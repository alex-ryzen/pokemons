import { DropArea, type Item } from "../types/app";
import { GRID_HEIGHT, GRID_WIDTH } from "../consts";

export class ItemGridFuncs {
    public static rectanglesIntersect(
        x1: number,
        y1: number,
        w1: number,
        h1: number,
        x2: number,
        y2: number,
        w2: number,
        h2: number
    ): boolean {
        return !( // - without ! -> positive case tha means absence of intersection (no intersection)
            (x2 >= x1 + w1 || x2 + w2 <= x1 || y2 >= y1 + h1 || y2 + h2 <= y1)
        );
    }
    public static isDroppable (
        items: Item[],
        item: Item | null,
        dropArea: DropArea | null,
        cellX: number,
        cellY: number
    ): boolean {
        if (item && dropArea && dropArea.startPos.x != null && dropArea.startPos.y != null &&
            (cellX >= dropArea.startPos.x &&
            cellX <= dropArea.endPos.x) && 
            (cellY >= dropArea.startPos.y &&
            cellY <= dropArea.endPos.y))
            return (this.canPlace(items, item))
        else
            return true;
    }

    public static canPlace(
        items: Item[],
        item: Item,
    ): boolean {
        const x = item.targetX ?? 0
        const y = item.targetY ?? 0
        if (
            x < 0 ||
            y < 0 ||
            x + item.width > GRID_WIDTH ||
            y + item.height > GRID_HEIGHT
        )
            return false;
        return !items.some((other) => {
            if (other.id === item.id) return false;
            return this.rectanglesIntersect(
                x,
                y,
                item.width,
                item.height,
                other.x,
                other.y,
                other.width,
                other.height
            );
        });
    }

    public static getDropArea(draggedItemObj: Item | null): DropArea | null {
        if (
            !draggedItemObj ||
            (!draggedItemObj.targetX && draggedItemObj.targetX !== 0) ||
            (!draggedItemObj.targetY && draggedItemObj.targetY !== 0)
        ) {
            return null;
        }
        return {
            startPos: {
                x: draggedItemObj.targetX,
                y: draggedItemObj.targetY,
            },
            endPos: {
                x: draggedItemObj.targetX + draggedItemObj.width - 1,
                y: draggedItemObj.targetY + draggedItemObj.height - 1,
            },
        };
    }

    public static checkOver(
        dropArea: DropArea | null,
        x: number,
        y: number
    ): boolean {
        // const [x, y] = id.split("-").map(Number);
        if (!dropArea) return false;
        return (
            x >= dropArea.startPos.x &&
            y >= dropArea.startPos.y &&
            x <= dropArea.endPos.x &&
            y <= dropArea.endPos.y
        );
    }
};

// console.log(`cellX >= dropArea.startPos.x ${cellX}>=${dropArea.startPos.x} ${cellX >= dropArea.startPos.x}  \ncellX <= dropArea.endPos.x ${cellX} <= ${dropArea.endPos.x} ${cellX <= dropArea.endPos.x} \ncellY >= dropArea.startPos.y ${cellY} >= ${dropArea.startPos.y} ${cellY >= dropArea.startPos.y} \ncellY <= dropArea.endPos.y ${cellY} <= ${dropArea.endPos.y} ${cellY <= dropArea.endPos.y}`)
