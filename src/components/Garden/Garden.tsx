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
                registerGridRef={registerGrid("grdn")}
            />
        </div>
    );
}

export default Garden;