import { GridArea } from "../UI/ItemGrid/GridArea";
import { useGridActions, useGridState } from "../../hooks/useGrid";
import styles from './garden.module.css'
import GardenService from "../UI/GardenService/GardenService";
import Characteristic from "../UI/Characteristic/Characteristic";
import { GRIDNAMES } from "../../consts";
import { useGetGradenBerriesQuery, useGetGradenServicesQuery } from "../../services/garden-service";

const Garden = () => {
    const { registerGrid } = useGridActions();
    const { activeItem, dropArea } = useGridState();
    const {data: berries} = useGetGradenBerriesQuery();
    const {data: services} = useGetGradenServicesQuery();
    return ( 
        <section className={styles.gardenSection}>
            <GridArea
                id={GRIDNAMES.garden}
                data={{ accepts: [GRIDNAMES.inventory] }}
                actualSize={25} // gets from the store - garden_size
                activeItem={activeItem}
                dropArea={dropArea}
                grid_cell_w={7}
                grid_cell_h={7} // max_grnd_size from store
                grid_cell_view_w={7}
                grid_cell_view_h={7}
                registerGridRef={registerGrid(GRIDNAMES.garden)}
            />
            <div className={styles.optionsContainer}>
                <div className={styles.servicesContainer}>
                    {services?.map((service, idx) => (
                        <GardenService key={"gs"+idx} gardenService={service} />
                    ))}
                </div>
                <Characteristic name={"Скорость роста"} value={"15%/час"}></Characteristic>
            </div>
            
        </section>
    );
}

export default Garden;