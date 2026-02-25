import styles from "./myPokemons.module.css"
import EntityCard from "../UI/EntityCard/EntityCard";
import Modal from "../UI/Modal/Modal";
import { useModal } from "../../hooks/useModal";
import { Tabs } from "../UI/Tabs/Tabs";
import { useTabs } from "../../hooks/useTabs";
import { TabConfig } from "../../types/app";
import ItemList from "../UI/ItemList/ItemList";
import Stats from "../UI/Stats/Stats";
import { initEntities, initPokemonFood, initStats } from "../../mocks/data";

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