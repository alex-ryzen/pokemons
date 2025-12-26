import React, { JSX, memo, useEffect, useRef, useState, type FC } from "react";
import styles from './homepage.module.css'
import Accordion from "../../components/UI/Accordion/Accordion";
import MyPokemons from "../../components/MyPokemons/MyPokemons";
import Garden from "../../components/Garden/Garden";
import { useAppDispatch } from "../../hooks";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useGridActions } from "../../hooks/useGrid";
import { setInventoryItems } from "../../store/item-process/inventorySlice";
import { DragOverlayWrapper } from "../../components/UI/ItemGrid/DragOverlayWrapper";
import Inventory from "../../components/Inventory/Inventory";
import Shop from "../../components/Shop/Shop";
import { IItem } from "../../types/app";

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

type MidItem = {
    key: string,
    title: string;
    component: (() => JSX.Element) | FC;
};

const MID_ITEMS: MidItem[] = [
    { key: "section_1", title: "My Pokemons", component: MyPokemons },
    { key: "section_2", title: "Garden", component: Garden },
    {
        key: "section_3", title: "Hunt", component: () =>
            <>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam magna velit, venenatis eget convallis ut, elementum non metus. Maecenas turpis neque, fermentum at congue ut, rhoncus eu erat. Integer ultricies a nisi et tincidunt. Donec commodo sapien eu nibh tempor, a sodales leo mollis. Integer sollicitudin enim suscipit odio fermentum, vel molestie urna semper. Mauris nisi lectus, feugiat id lacinia quis, placerat eu purus. Aliquam erat volutpat. Integer eu tellus in nibh condimentum maximus. Cras non leo quis sapien imperdiet sodales. Proin scelerisque feugiat nisl a pellentesque. Cras vitae porttitor quam. Donec imperdiet ex non neque pharetra commodo. Vivamus commodo at mauris eget ullamcorper. Duis pretium metus id diam convallis facilisis. Pellentesque sagittis justo ut purus tincidunt aliquet.

                Nulla finibus luctus lorem, ac elementum neque consequat id. Praesent sit amet augue viverra, pulvinar elit eu, imperdiet tortor. Proin facilisis venenatis volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla eu tincidunt ligula. Pellentesque mattis, felis eu aliquet egestas, odio lorem pretium nulla, consequat maximus ex diam sed mi. Etiam posuere ligula sit amet ultricies tincidunt. Duis venenatis dui sed felis fermentum, congue ornare eros bibendum. Nam sit amet tempor quam, id fringilla eros. Donec sed pellentesque massa. Proin congue tempus ante, eget lobortis lectus sodales a.

                Sed commodo magna magna, in pulvinar dolor fermentum vitae. Suspendisse potenti. Phasellus ultricies metus eu eros gravida lobortis. Nullam ut purus erat. Morbi libero felis, faucibus non tincidunt at, malesuada eget ipsum. Praesent eget dui egestas, faucibus metus facilisis, malesuada ipsum. Mauris ex leo, imperdiet ac dolor eu, maximus tristique tortor. Duis sit amet ex in urna eleifend consequat.

                Donec sed massa magna. Duis mattis turpis augue, a cursus neque tincidunt non. Proin sagittis neque id cursus venenatis. Duis mollis, mauris quis mollis dictum, velit ante ullamcorper quam, pharetra hendrerit velit metus et libero. Fusce nec augue id elit fringilla suscipit. Curabitur dapibus egestas commodo. Morbi tristique ullamcorper rhoncus. Nulla dapibus tincidunt purus, non egestas nisl tincidunt cursus. Interdum et malesuada fames ac ante ipsum primis in faucibus. In bibendum erat mi, sed varius tellus pretium ut.

                Morbi interdum ultricies lacinia. Pellentesque in tortor purus. Morbi eu maximus neque. Proin bibendum finibus dapibus. Duis ut tincidunt augue. Vestibulum auctor velit a aliquet rutrum. Morbi efficitur tincidunt scelerisque. Sed non fringilla justo. Nullam vehicula orci eleifend euismod imperdiet. Donec elementum malesuada ipsum quis commodo. Suspendisse viverra odio id tristique varius. Integer mattis justo rhoncus pharetra cursus. Curabitur sodales tellus non pharetra sollicitudin. Sed non dignissim arcu, rhoncus mollis mauris. Cras volutpat gravida lectus, quis ultrices lacus venenatis non. Nulla imperdiet finibus orci vel tincidunt.

                Suspendisse eget turpis pretium, auctor sapien eu, cursus risus. Fusce vel faucibus ante, a aliquet ipsum. Sed ac fringilla metus. Quisque finibus nunc blandit eleifend iaculis. Suspendisse eleifend erat quam, eu dignissim velit finibus quis. Vivamus consectetur pretium pharetra. Nullam nisl mauris, interdum vitae sapien in, ullamcorper sagittis neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

                Nullam vehicula vulputate bibendum. Vestibulum feugiat, nisl eu sodales dapibus, odio velit lobortis odio, vel iaculis massa risus sit amet felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam posuere consectetur dui eu ultrices. Praesent iaculis pellentesque lacinia. Aliquam eu viverra mauris. Aliquam vel est eleifend, rhoncus magna sit amet, scelerisque odio. Aenean auctor pharetra orci id viverra. Morbi rutrum dolor quis placerat dignissim. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur vitae pulvinar urna. Maecenas auctor tellus non tellus hendrerit lobortis. Integer vehicula iaculis ornare.
            </>
    }
];

const HomePage = memo(() => {
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
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
        dispatch(setInventoryItems(initItems));
    }, []);

    useEffect(() => {
        console.log("ПЕРЕРИСОВКА HOME PAGE ,", containerRef.current?.clientHeight)
    })
    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            autoScroll={false}
        >
            <main className={`${styles["content"]}`}>
                <aside
                    className={`${styles["content-aside"]} content-block`}
                    style={{ order: 0 }}
                >
                    <div className={styles.asideContentContainer}>
                        <Inventory></Inventory>
                    </div>
                </aside>
                <div
                    className={styles["content-wrapper"]}
                    style={{ order: 1 }}
                >
                    <div ref={containerRef} className={styles['content-container']}>
                        {MID_ITEMS.map((item, idx) => (
                            <Accordion
                                key={item.key}
                                isOpen={openIdx === idx}
                                title={item.title}
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                sectionsCount={MID_ITEMS.length}
                                containerRef={containerRef}
                            >
                                {React.createElement(item.component)}
                            </Accordion>
                        ))}
                    </div>
                </div>
                <aside
                    className={`${styles["content-aside"]} content-block`}
                    style={{ order: 2 }}
                >
                    <div className={styles.asideContentContainer}>
                        <Shop></Shop>
                    </div>
                </aside>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    );
})

export default HomePage;