import { memo, useRef } from "react";
import { useGridActions, useGridState } from "../../hooks/useGrid";
import BlockTitle from "../UI/BlockTitle/BlockTitle";
import { GridArea } from "../UI/ItemGrid/GridArea";
import styles from "./inventory.module.css";
import { GRIDNAMES } from "../../consts";
import { useGetInventoryItemsQuery } from "../../services/inventory-service";
import Loader from "../UI/Loader/Loader";

const Inventory = memo(() => {
    const { registerGrid } = useGridActions();
    const { activeItem, dropArea } = useGridState();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const {isError, isLoading, isSuccess} = useGetInventoryItemsQuery();
    return (
        <div className={styles.inventoryWrapper}>
            <div className={styles.inventory}>
                <BlockTitle style={{ padding: "16px" }}>Inventory</BlockTitle>
                { isError && <p data-testid="error-msg">inventory fetch error</p>}
                { isLoading && <Loader></Loader> }
                { isSuccess &&
                    <div ref={wrapperRef} className={styles.itemGridWrapper}>
                        <GridArea
                            id={GRIDNAMES.inventory}
                            data={{ accepts: [GRIDNAMES.inventory, GRIDNAMES.garden] }}
                            actualSize={15} // gets from the store - inventory_size
                            activeItem={activeItem}
                            dropArea={dropArea}
                            grid_cell_h={50} // max_inv_size from store
                            grid_cell_w={5}
                            grid_cell_view_h={10}
                            grid_cell_view_w={5}
                            wrapperRef={wrapperRef}
                            registerGridRef={registerGrid(GRIDNAMES.inventory)}
                            extentionPrice={1000} // gets from the store - inventory_extention_price
                        />
                    </div>
                }
            </div>
        </div>
    );
});

export default Inventory;
