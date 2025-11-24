import { GridArea } from "../UI/ItemGrid/GridArea";
import { useGrid } from "../../hooks/useGrid";

const Garden = () => {
    const { registerGrid, activeItem, dropArea } = useGrid();
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