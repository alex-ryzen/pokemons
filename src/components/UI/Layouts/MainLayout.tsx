import { CSSProperties, ReactNode, useEffect, useState } from "react";
import styles from "./mainLayout.module.css";
import { Outlet } from "react-router";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { CELL_SIZE, GENERAL_GAP, GENERAL_PADDING, GRID_GAP, HEADER_HEIGHT } from "../../../consts";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { Grid, IItem } from "../../../types/app";
import { useAppDispatch } from "../../../hooks";
import { useGrid } from "../../../hooks/useGrid";
import { setItems } from "../../../store/item-process/itemSlice";
import { GridItem } from "../ItemGrid/GridItem";
import { GridProvider } from "../../../contexts/GridContext";

export interface MainLayoutProps {
    mainContent?: ReactNode;
    siderLContent?: ReactNode;
    siderRContent?: ReactNode;
}

//const mainLayoutStyle: CSSProperties = {}
const asideStyle: CSSProperties = {
    maxHeight: `calc(100% - 2 * ${GENERAL_PADDING}px - ${GENERAL_GAP}px - ${HEADER_HEIGHT}px)`,
};

const grids: Grid[] = [
    { id: "inv", data: { accepts: ["inv", "grdn"] } },
    { id: "grdn", data: { accepts: ["inv", "grdn"] } },
];

const initItems: IItem[] = [
    {
        id: "item1",
        itemId: "item1",
        gridId: "inv",
        category: "berry",
        cSize: 2,
        cPosX: 3,
        cPosY: 3,
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png",
    },
    {
        id: "item2",
        itemId: "item2",
        gridId: "inv",
        category: "pokeball",
        cSize: 1,
        cPosX: 0,
        cPosY: 0,
        img: "/images/items/2f7faec4d1353f1810511eb434ea4b2981205bf6.png",
    },
    {
        id: "item3",
        itemId: "item3",
        gridId: "inv",
        category: "pokeball",
        cSize: 1,
        cPosX: 1,
        cPosY: 2,
        img: "/images/items/1c8e6d145c9ef9b8ec6a860ea8bf65c115fb1539.png",
    },
    {
        id: "item4",
        itemId: "item4",
        gridId: "grdn",
        category: "pokeball",
        cSize: 1,
        cPosX: 3,
        cPosY: 4,
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png",
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
        activeItem,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleDragCancel,
    } = useGrid();

    useEffect(() => {
        if (activeItem) {
            document.body.classList.add("is-dragging");
        } else {
            document.body.classList.remove("is-dragging");
        }
    }, [activeItem]);

    useEffect(() => {
        dispatch(setItems(initItems));
    }, []);
    return (
        <div className={styles.layout}>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                autoScroll={false}
            >
                <Header />
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
                <DragOverlay>
                    {activeItem ? (
                        <GridItem
                            text={`Move ${activeItem.id}`}
                            style={{
                                width:
                                    activeItem.cSize * (CELL_SIZE + GRID_GAP) -
                                    GRID_GAP,
                                height:
                                    activeItem.cSize * (CELL_SIZE + GRID_GAP) -
                                    GRID_GAP,
                                backgroundColor: "rgba(63, 81, 181, 0.8)",
                                color: "white",
                                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                                cursor: "grab",
                            }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
            {/* <Footer/> */}
        </div>
    );
};

export default MainLayout;
