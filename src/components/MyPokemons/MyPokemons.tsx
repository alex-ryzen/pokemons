import styles from "./myPokemons.module.css"
import EntityCard, { EntityCardProps } from "../UI/EntityCard/EntityCard";
import Modal from "../UI/Modal/Modal";
import { useModal } from "../../hooks/useModal";
import { Tabs } from "../UI/Tabs/Tabs";
import { useTabs } from "../../hooks/useTabs";
import { TabConfig } from "../../types/app";
import { ItemCardProps } from "../UI/ItemCard/ItemCard";
import ItemList from "../UI/ItemList/ItemList";
import {v4 as uuidv4} from 'uuid'
import Stats from "../UI/Stats/Stats";
import { CharacteristicProps } from "../UI/Characteristic/Characteristic";


const initStats: Array<CharacteristicProps> = [
    {name: "Вид", value: "clefairy"},
    {name: "Вес", value: "12 кг"},
    {name: "Суммарно заработано", value: "11 200"},
    {name: "Денег/сек", value: "1.1"},
    {name: "Возраст", value: "1 день"},
]

const initEntities: Omit<EntityCardProps, 'onOpen'>[] = Array.from({length: 6}, (_, idx) => ({
    id: uuidv4(),
    title: "clefairy",
    properties: [
        {name: "Вес", value: `${12} кг`},
        {name: "Денег/сек", value: 1.1}
    ],
    img: "/images/items/clefairy.png",
}))

const initPokemonFood: ItemCardProps[] = [
    {
        title: "Ягода 1 уровня",
        description: "Накорми ей покемона для увеличения веса на 0.1 кг",
        buttonTxt: "Накормить",
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png", 
    },
    {
        title: "Ягода 1 уровня",
        description: "Накорми ей покемона для увеличения веса на 0.1 кг",
        buttonTxt: "Накормить",
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png", 
    },
    {
        title: "Ягода 1 уровня",
        description: "Накорми ей покемона для увеличения веса на 0.1 кг",
        buttonTxt: "Накормить",
        img: "/images/items/d3c0698fdebee1e1c412fdd15288a696c106dd6e.png", 
    }
]

const initPokemonTabs: TabConfig[] = [
    {
        key: "feed",
        label: "Накормить",
        content: 
            <ItemList 
                items={initPokemonFood}
                wrapperStyles={{ padding: "10px 24px" }}
                containerStyles={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
            ></ItemList>
    },
    {
        key: "stats",
        label: "Статистика",
        content: <Stats
                    stats={initStats}
                ></Stats>
    }
]

const MyPokemons = () => {
    const {isOpen, open, close, overlayRef} = useModal()
    const tabProps = useTabs(initPokemonTabs, "feed")
    const thumbnailModalTitle = `Управление покемоном ${initEntities[0].title}`

    return ( 
        <section className={styles.pokemonSection}>
            <div className={styles.pokemonSectionContainer}>
            {initEntities.map((prop, idx) => 
                <EntityCard key={idx} {...prop} onOpen={open}></EntityCard>
            )}
            </div>
            <Modal open={isOpen} onClose={close} overlayRef={overlayRef} title={thumbnailModalTitle}>
                <Tabs {...tabProps}></Tabs>
            </Modal>
        </section>
    );
}
 
export default MyPokemons;