import { useGrid } from "../../hooks/useGrid";
import { IItem } from "../../types/app";
import BlockTitle from "../UI/BlockTitle/BlockTitle";
import { GridArea } from "../UI/ItemGrid/GridArea";
import styles from "./inventory.module.css";

const Inventory = () => {
    const { registerGrid, activeItem, dropArea } = useGrid();
    return (
        <div className={styles.inventoryWrapper}>
            <div className={styles.inventory}>
                <BlockTitle style={{ padding: "16px" }}>Inventory</BlockTitle>
                <div className={styles.itemGridWrapper}>
                    <GridArea
                        id="inv"
                        data={{ accepts: ["inv", "grdn"] }}
                        activeItem={activeItem}
                        dropArea={dropArea}
                        registerGridRef={registerGrid("inv")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Inventory;
