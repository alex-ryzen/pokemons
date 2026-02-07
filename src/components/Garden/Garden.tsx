import { GridArea } from "../UI/ItemGrid/GridArea";
import { useGridActions, useGridState } from "../../hooks/useGrid";
import styles from './garden.module.css'
import { IGardenService } from "../../types/app";
import GardenService from "../UI/GardenService/GardenService";
import Characteristic from "../UI/Characteristic/Characteristic";

const initServices: Partial<IGardenService>[] = [
    {
        title: "Увеличить площадь грядки",
        price: 1000
    },
    {
        title: "Ускорить рост на 2%/час на 2 часа",
        price: 2000
    },
    {
        title: "Ускорить рост на 5%/час на 2 часа",
        price: 5000
    },
] 

const Garden = () => {
    const { registerGrid } = useGridActions();
    const { activeItem, dropArea } = useGridState();
    return ( 
        <section className={styles.gardenSection}>
            <GridArea
                id="grdn"
                data={{ accepts: ["inv", "grdn"] }}
                actualSize={25} // gets from the store - garden_size
                activeItem={activeItem}
                dropArea={dropArea}
                grid_cell_w={7}
                grid_cell_h={7} // max_inv_size from store
                grid_cell_view_w={7}
                grid_cell_view_h={7}
                registerGridRef={registerGrid("grdn")}
            />
            <div className={styles.optionsContainer}>
                <div className={styles.servicesContainer}>
                    {initServices.map((service, idx) => (
                        <GardenService key={"gs"+idx} gardenService={service} />
                    ))}
                </div>
                <Characteristic name={"Скорость роста"} value={"15%/час"}></Characteristic>
            </div>
            
        </section>
    );
}

export default Garden;