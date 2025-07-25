import React, { useState } from "react"
import { GRID_HEIGHT_INIT, GRID_WIDTH_INIT } from "../../store/consts";
import { type Cell, type Item } from "../../types/app";


const createEmptyGrid = (): Cell[][] =>
    Array.from({ length: GRID_HEIGHT_INIT }, () =>
        Array.from({ length: GRID_WIDTH_INIT }, () => ({}))
    );

const ItemGrid: React.FC = () => {
    const [grid, setGrid] = useState(createEmptyGrid());
    const [items, setItems] = useState<Item[]>([
        { id: "item1", cellWidth: 2, cellHeight: 2, x: 0, y: 0, name: "покебол1" },
        { id: "item2", cellWidth: 1, cellHeight: 3, x: 3, y: 1, name: "покебол2" },
    ]);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const canPlace = (item: Item, x: number, y: number) => {
        for (let dy = 0; dy < item.cellHeight; dy++) {
            for (let dx = 0; dx < item.cellWidth; dx++) {
                if (
                    y + dy >= GRID_HEIGHT_INIT ||
                    x + dx >= GRID_WIDTH_INIT ||
                    grid[y + dy][x + dx].itemId
                ) {
                    return false;
                }
            }
        }
        return true;
    };

    const placeItem = (item: Item, x: number, y: number) => {
        const newGrid = createEmptyGrid();
        items.forEach((i) => {
            if (i.id !== item.id) {
                for (let dy = 0; dy < i.cellHeight; dy++) {
                    for (let dx = 0; dx < i.cellWidth; dx++) {
                        newGrid[i.y + dy][i.x + dx].itemId = i.id;
                    }
                }
            }
        });
        for (let dy = 0; dy < item.cellHeight; dy++) {
            for (let dx = 0; dx < item.cellWidth; dx++) {
                newGrid[y + dy][x + dx].itemId = item.id;
            }
        }
        setGrid(newGrid);
        setItems((prev) =>
            prev.map((i) =>
                i.id === item.id ? { ...i, x, y } : i
            )
        );
    };

    const handleDragStart = (id: string) => setDraggedItemId(id);
    const handleDrop = (x: number, y: number) => {
        const item = items.find((i) => i.id === draggedItemId);
        if (item && canPlace(item, x, y)) {
            placeItem(item, x, y);
        }
        setDraggedItemId(null);
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_WIDTH_INIT}, 40px)`,
                gridTemplateRows: `repeat(${GRID_HEIGHT_INIT}, 40px)`,
                gap: 2,
            }}
        >
            {grid.map((row, y) =>
                row.map((cell, x) => {
                    const item = items.find(
                        (i) =>
                            x >= i.x &&
                            x < i.x + i.cellWidth &&
                            y >= i.y &&
                            y < i.y + i.cellHeight
                    );
                    // Отображаем только левый верхний угол предмета
                    const isItemRoot =
                        item && item.x === x && item.y === y;
                    return (
                        <div
                            key={`${x}-${y}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(x, y)}
                            style={{
                                width: 40,
                                height: 40,
                                border: "1px solid #aaa",
                                background: isItemRoot
                                    ? "#bde0fe"
                                    : cell.itemId
                                        ? "#e0e0e0"
                                        : "#fff",
                                position: "relative",
                            }}
                        >
                            {isItemRoot && (
                                <div
                                    draggable
                                    onDragStart={() => handleDragStart(item.id)}
                                    style={{
                                        width: item.cellWidth * 40 - 4,
                                        height: item.cellHeight * 40 - 4,
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        background: "#90caf9",
                                        border: "2px solid #1976d2",
                                        boxSizing: "border-box",
                                        cursor: "grab",
                                        zIndex: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.name}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ItemGrid;
