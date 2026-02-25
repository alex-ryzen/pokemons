import styles from "./mainLayout.module.css";
import { Outlet } from "react-router";
import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
import CTXProviderComposer from "../../../contexts/CTXProviderComposer";
import { GridProvider } from "../../../contexts/GridContext";

export interface MainLayoutProps {
    // props (optional)
}

const MainProviders = CTXProviderComposer([
    // { provider: FilterProvider, value: { content: initialFilter } }
    { provider: GridProvider }
])

const MainLayout = ({}: MainLayoutProps) => {
    return (
        <MainProviders>
            <div className={styles.mainLayout}>
                <Header />
                <Outlet />
                {/* <Footer /> no footer actually */}
            </div>
        </MainProviders>
    );
};

export default MainLayout;
