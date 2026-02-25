describe("Login Page", () => {
    beforeEach(() => {
        cy.visit("/auth");
    });

    it("should switch tabs by role and name", () => {
        cy.findByRole("tab", { name: /tab-reg/i }).click();
        
        cy.findByRole("tab", { name: /tab-reg/i }).should(
            "have.attr",
            "aria-selected",
            "true",
        );

        cy.findByRole("tabpanel", { name: /tabpanel-reg/i }).within(() => {
            cy.findByLabelText(/email/i).should("be.visible");
            cy.findByLabelText(/password confirmation/i).should("be.visible");
        });

        cy.findByRole("tab", { name: /tab-log/i }).click();

        cy.findByRole("tab", { name: /tab-log/i }).should(
            "have.attr",
            "aria-selected",
            "true",
        );

        cy.findByRole("tabpanel", { name: /tabpanel-log/i }).within(() => {
            cy.findByLabelText(/login/i).should("be.visible");
            cy.findByLabelText(/email/i).should("not.exist");
        });
    });

    it("should switch tabs by visible text", () => {
        cy.contains("button", "Sign up").click();
        cy.findByRole('tabpanel', { name: /tabpanel-reg/i }).within(() => {
            cy.contains("label", "Email").should("be.visible");
            cy.contains("label", "Password confirmation").should("be.visible");
        });
        cy.contains("button", "Sign in").click();
        cy.findByRole('tabpanel', { name: /tabpanel-log/i }).within(() => {
            cy.contains("label", "Login").should("be.visible");
            cy.contains("label", "Email").should("not.exist");
        });
    });

    it("should switch tabs by testid", () => {
        cy.findByTestId("tab-log").should(
            "have.attr",
            "aria-selected",
            "true",
        );

        cy.findByTestId("tab-reg").click();
        cy.findByTestId("tab-reg").should(
            "have.attr",
            "aria-selected",
            "true",
        );
        cy.findByTestId("tab-log").should(
            "have.attr",
            "aria-selected",
            "false",
        );

        cy.findByTestId("tabpanel-reg").should("be.visible");
        cy.findByTestId("tabpanel-log").should("not.be.visible");
    });

    it("should switch tabs by index", () => {
        cy.get('[role="tab"]').eq(1).click();

        cy.get('[role="tab"]')
            .eq(1)
            .should("have.attr", "aria-selected", "true");
        cy.get('[role="tabpanel"]').eq(1).should("be.visible");
    });

    it("should preserve form data when switching tabs", () => {
        cy.findByRole("tab", { name: 'tab-log'}).click();
        cy.findByRole('tabpanel', { name: 'tabpanel-log' }).within(() => {
            cy.findByLabelText(/login/i).type('testuser');
            cy.findByLabelText(/password/i).type('Password123!');
        });

        cy.findByRole("tab", { name: 'tab-reg' }).click();
        cy.findByRole('tabpanel', { name: 'tabpanel-reg' }).within(() => {
            cy.findByLabelText(/login/i).type("newuser");
            cy.findByLabelText(/email/i).type("new@test.com");
        });

        cy.findByRole("tab", { name: 'tab-log' }).click();
        cy.findByRole('tabpanel', { name: 'tabpanel-log' }).within(() => {
            cy.findByLabelText(/login/i).should("have.value", "testuser");
            cy.findByLabelText(/password/i).should("have.value", "Password123!");
        });
    });

    it("should not reset forms when switching tabs", () => {
        cy.findByRole("tab", { name: /tab-reg/i }).click();
        cy.wait(300);
        cy.findByRole('tabpanel', { name: /tabpanel-reg/i }).within(() => {
            cy.findByLabelText(/login/i).type("newuser");
            cy.findByLabelText(/email/i).type("new@test.com");
            cy.findByLabelText(/^password$/i).first().type("Password123!");
            cy.findByLabelText(/password confirmation/i).type("Password123!");
        });
        cy.findByRole("tab", { name: /tab-log/i }).click();
        cy.findByRole("tab", { name: /tab-reg/i }).click();
        cy.findByRole("tab", { name: /tab-log/i }).click();
        cy.findByRole("tab", { name: /tab-reg/i }).click();
        cy.wait(300);
        cy.findByRole('tabpanel', { name: /tabpanel-reg/i }).within(() => {
            cy.findByLabelText(/login/i).should("have.value", "newuser");
            cy.findByLabelText(/email/i).should("have.value", "new@test.com");
        });
    });

    it("should highlight active tab", () => {
        cy.findByRole("tab", { name: /tab-log/i }).click();
        cy.wait(300);
        cy.findByRole("tab", { name: /tab-log/i })
            .should("have.attr", "aria-selected", "true")
            .and("have.css", "color", "rgb(54, 95, 172)")
        cy.findByRole("tab", { name: /tab-reg/i }).click();
        cy.wait(300);
        cy.findByRole("tab", { name: /tab-reg/i })
            .should("have.attr", "aria-selected", "true")
            .and("have.css", "color", "rgb(54, 95, 172)");
        cy.findByRole("tab", { name: /tab-log/i })
            .should("have.attr", "aria-selected", "false");
    });

    it("should have correct accessibility attributes", () => {
        cy.findByRole("tab", { name: /tab-log/i }).click();
        cy.findByRole("tab", { name: /tab-log/i }).should(
            "have.attr",
            "aria-selected",
            "true",
        );
        cy.findByRole("tab", { name: /tab-reg/i }).should(
            "have.attr",
            "aria-selected",
            "false",
        );
        cy.findByRole("tab", { name: /tab-log/i }).should(
            "have.attr",
            "aria-controls",
            "tabpanel-log",
        );
        cy.findByRole("tabpanel", { name: /tabpanel-log/i }).should(
            "have.attr",
            "id",
            "tabpanel-log",
        );
    });
});
