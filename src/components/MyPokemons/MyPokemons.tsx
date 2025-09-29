import { FC } from "react";
import styles from "./myPokemons.module.css"
import EntityCard, { EntityCardProps } from "../UI/EntityCard/EntityCard";


const initEntities: EntityCardProps[] = Array.from({length: 6}, (_, idx) => ({
    title: "clefairy",
    properties: [
        {name: "Вес", value: `${12} кг`},
        {name: "Денег/сек", value: 1.1}
    ],
    img: "/images/items/clefairy.png",
}))

const MyPokemons: FC = () => {
    return ( 
        <section className={styles.pokemonSection}>
            <div className={styles.pokemonSectionContainer}>
            {initEntities.map((prop, idx) => 
                <EntityCard key={idx} {...prop}></EntityCard>
            )}
            </div>
        </section>
    );
}
 
export default MyPokemons;