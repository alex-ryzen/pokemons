import { memo, useEffect, useRef } from "react";
import { useGridActions, useGridState } from "../../hooks/useGrid";
import BlockTitle from "../UI/BlockTitle/BlockTitle";
import { GridArea } from "../UI/ItemGrid/GridArea";
import styles from "./inventory.module.css";

const Inventory = memo(() => {
    const { registerGrid } = useGridActions();
    const { activeItem, dropArea } = useGridState();
    const wrapperRef = useRef<HTMLDivElement>(null);
    return (
        <div className={styles.inventoryWrapper}>
            <div className={styles.inventory}>
                <BlockTitle style={{ padding: "16px" }}>Inventory</BlockTitle>
                <div ref={wrapperRef} className={styles.itemGridWrapper}>
                    <GridArea
                        id="inv"
                        data={{ accepts: ["inv", "grdn"] }}
                        actualSize={15} // gets from the store - inventory_size
                        activeItem={activeItem}
                        dropArea={dropArea}
                        grid_cell_h={100} // max_inv_size from store
                        grid_cell_w={5}
                        grid_cell_view_h={10}
                        grid_cell_view_w={5}
                        wrapperRef={wrapperRef}
                        registerGridRef={registerGrid("inv")}
                        extentionPrice={1000} // gets from the store - inventory_extention_price
                    />
                </div>
            </div>
        </div>
    );
});

export default Inventory;
