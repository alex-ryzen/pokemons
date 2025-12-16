import { ReactNode, useEffect } from "react";
import styles from "./mainLayout.module.css";
import { Outlet } from "react-router";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { Grid, IItem } from "../../../types/app";
import { useAppDispatch } from "../../../hooks";
import { useGridActions } from "../../../hooks/useGrid";
import { setInventoryItems } from "../../../store/item-process/inventorySlice";
import CTXProviderComposer from "../../../contexts/CTXProviderComposer";
import { DragOverlayWrapper } from "../ItemGrid/DragOverlayWrapper";

export interface MainLayoutProps {
    mainContent?: ReactNode;
    siderLContent?: ReactNode;
    siderRContent?: ReactNode;
}

const grids: Grid[] = [
    { id: "inv", data: { accepts: ["inv", "grdn"] } },
    { id: "grdn", data: { accepts: ["inv", "grdn"] } },
];

const MainProviders = CTXProviderComposer([
    // { provider: FilterProvider, value: { content: initialFilter } }
])

const initItems: IItem[] = [
    {
        id: "item1",
        itemId: "item1",
        gridId: "inv",
        category: "berry",
        cSize: 2,
        cPosX: 3,
        cPosY: 3,
        image: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png",
    },
    {
        id: "item2",
        itemId: "item2",
        gridId: "inv",
        category: "pokeball",
        cSize: 1,
        cPosX: 0,
        cPosY: 0,
        image: "/images/items/2f7faec4d1353f1810511eb434ea4b2981205bf6.png",
    },
    {
        id: "item3",
        itemId: "item3",
        gridId: "inv",
        category: "pokeball",
        cSize: 1,
        cPosX: 1,
        cPosY: 2,
        image: "/images/items/1c8e6d145c9ef9b8ec6a860ea8bf65c115fb1539.png",
    },
    {
        id: "item4",
        itemId: "item4",
        gridId: "grdn",
        category: "pokeball",
        cSize: 1,
        cPosX: 3,
        cPosY: 4,
        image: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png",
    },
];

const MainLayout = ({
    mainContent,
    siderLContent,
    siderRContent,
}: MainLayoutProps) => {
    const dispatch = useAppDispatch();
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const {
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleDragCancel,
    } = useGridActions();

    useEffect(() => {
        console.log("ПЕРЕРИСОВОЧКА")
    });
    useEffect(() => {
        dispatch(setInventoryItems(initItems));
    }, []);
    return (
        <div className={styles.layout}>
            <MainProviders>
                <Header />
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    autoScroll={false}
                >
                    <main className={`${styles["content-layout"]}`}>
                        <aside
                            className={`${styles["content-aside"]} content-block`}
                            style={{ order: 0 }}
                        >
                            <div className={styles.asideContentContainer}>
                                {siderLContent}
                            </div>
                        </aside>
                        <div
                            className={styles["content-wrapper"]}
                            style={{ order: 1 }}
                        >
                            {mainContent ? mainContent : <Outlet />}
                        </div>
                        <aside
                            className={`${styles["content-aside"]} content-block`}
                            style={{ order: 2 }}
                        >
                            <div className={styles.asideContentContainer}>
                                {siderRContent}
                            </div>
                        </aside>
                    </main>
                    <DragOverlayWrapper />
                </DndContext>
                <Footer />
            </MainProviders>
            {/* <Footer/> */}
        </div>
    );
};

export default MainLayout;
