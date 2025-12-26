import { GridArea } from "../UI/ItemGrid/GridArea";
import { useGridActions, useGridState } from "../../hooks/useGrid";

const Garden = () => {
    const { registerGrid } = useGridActions();
    const { activeItem, dropArea } = useGridState();
    return ( 
        <div>
            <GridArea
                id="grdn"
                data={{ accepts: ["inv", "grdn"] }}
                activeItem={activeItem}
                dropArea={dropArea}
                grid_cell_w={7}
                grid_cell_h={7}
                grid_cell_view_w={7}
                grid_cell_view_h={7}
                registerGridRef={registerGrid("grdn")}
            />
        </div>
    );
}

export default Garden;