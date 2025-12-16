import { RefObject, Ref } from "react";
import { DropArea, IGridItem } from "../types/app";
import { GRID_CELL_H, GRID_CELL_W } from "../consts";

/**
 * Merges batch of React Refs into single callback-ref
 *
 * @param refs ref array for merging;
 * @returns single callback-ref, which assings a value to all passed ref;
 */
export function mergeRefs<T>(...refs: (Ref<T> | undefined | null)[]) {
    return (value: T | null) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as RefObject<T | null>).current = value;
            }
        });
    };
}

export class ItemGridFuncs {
    static rectanglesIntersect(
        x1: number,
        y1: number,
        s1: number,
        x2: number,
        y2: number,
        s2: number
    ): boolean {
        return !(x2 >= x1 + s1 || x2 + s2 <= x1 || y2 >= y1 + s1 || y2 + s2 <= y1);
    }

    static canPlace(items: IGridItem[], item: IGridItem): boolean {
        const x = item.cTargetX ?? item.cPosX;
        const y = item.cTargetY ?? item.cPosY;
        const size = item.cSize;

        if (x < 0 || y < 0 || x + size > GRID_CELL_W || y + size > GRID_CELL_H) {
            return false;
        }

        return !items.some((other) => {
            if (other.id === item.id) return false;
            return this.rectanglesIntersect(
                x,
                y,
                size,
                other.cTargetX ?? other.cPosX,
                other.cTargetY ?? other.cPosY,
                other.cSize
            );
        });
    }

    static getDropArea(item: IGridItem): DropArea | null {
        const x = item.cTargetX;
        const y = item.cTargetY;

        if (x === undefined || y === undefined) return null;

        return {
            startX: x,
            startY: y,
            endX: x + item.cSize - 1,
            endY: y + item.cSize - 1,
        };
    }

    static isCovered(dropArea: DropArea | null, x: number, y: number): boolean {
        if (!dropArea) return false;
        return (
            x >= dropArea.startX &&
            x <= dropArea.endX &&
            y >= dropArea.startY &&
            y <= dropArea.endY
        );
    }

    static isDroppable(
        items: IGridItem[],
        activeItem: IGridItem | null,
        dropArea: DropArea | null,
        x: number,
        y: number
    ): boolean {
        if (this.isCovered(dropArea, x, y) && activeItem) {
            return this.canPlace(items, activeItem);
        }
        return false;
    }
}

// console.log(`cellX >= dropArea.startPos.x ${cellX}>=${dropArea.startPos.x} ${cellX >= dropArea.startPos.x}  \ncellX <= dropArea.endPos.x ${cellX} <= ${dropArea.endPos.x} ${cellX <= dropArea.endPos.x} \ncellY >= dropArea.startPos.y ${cellY} >= ${dropArea.startPos.y} ${cellY >= dropArea.startPos.y} \ncellY <= dropArea.endPos.y ${cellY} <= ${dropArea.endPos.y} ${cellY <= dropArea.endPos.y}`)

// export type Size = {
//   // any w and h: absolute or cell
//   h: number;
//   w: number;
// };

// export type Coordinates = {
//   // any x and y: absolute or cell
//   x: number;
//   y: number;
// };

// export type DropAreaLocal = {
//   startPos: Coordinates;
//   endPos: Coordinates;
// };