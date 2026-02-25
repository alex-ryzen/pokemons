import { RefObject, Ref } from "react";
import { DropArea, IGridItem } from "../types/app";

// idea: make an intersection detection based on BitSet (Bit Mask) Matrix

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
        s2: number,
    ): boolean {
        return !(
            x2 >= x1 + s1 ||
            x2 + s2 <= x1 ||
            y2 >= y1 + s1 ||
            y2 + s2 <= y1
        );
    }

    static canPlace(
        items: IGridItem[],
        item: IGridItem,
        grid_c_w: number,
        grid_c_h: number,
        max_c_h: number,
    ): boolean {
        const x = item.cTargetX ?? item.cPosX;
        const y = item.cTargetY ?? item.cPosY;
        const size = item.cSize;

        if (
            x < 0 ||
            y < 0 ||
            x + size > grid_c_w ||
            y + size > grid_c_h ||
            y + size > max_c_h
        ) {
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
                other.cSize,
            );
        });
    }

    static getDropArea(item: IGridItem | null): DropArea | null {
        const x = item?.cTargetX;
        const y = item?.cTargetY;

        if (!item || x === undefined || y === undefined) return null;

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
        y: number,
        grid_c_w: number,
        grid_c_h: number,
        max_c_h: number,
    ): boolean {
        if (this.isCovered(dropArea, x, y) && activeItem) {
            return this.canPlace(
                items,
                activeItem,
                grid_c_w,
                grid_c_h,
                max_c_h,
            );
        }
        return false;
    }
}

// [AI] !!ATTENTION!! [AI]: gemini solution - to review and use as a more powerful solution
export class BitsetGrid {
    private readonly rows: BigUint64Array[];
    private readonly segmentsPerRow: number;
    private readonly BITS = 64n;

    constructor(
        public readonly width: number,
        public readonly height: number,
    ) {
        this.segmentsPerRow = Math.ceil(width / Number(this.BITS));
        // Каждая строка — это типизированный массив 64-битных чисел
        this.rows = Array.from(
            { length: height },
            () => new BigUint64Array(this.segmentsPerRow),
        );
    }

    /**
     * Проверка: поместится ли объект
     */
    canPlace(x: number, y: number, w: number, h: number): boolean {
        // 1. Быстрая проверка границ
        if (x < 0 || y < 0 || x + w > this.width || y + h > this.height)
            return false;

        for (let rowOffset = 0; rowOffset < h; rowOffset++) {
            const currentRow = this.rows[y + rowOffset];

            // Проверяем только те 64-битные сегменты, которые пересекает объект
            let remainingW = w;
            let currentX = x;

            while (remainingW > 0) {
                const segmentIdx = Math.floor(currentX / Number(this.BITS));
                const bitOffset = BigInt(currentX % Number(this.BITS));

                // Сколько бит берем в текущем сегменте (не более 64)
                const bitsInThisSegment = this.min(
                    BigInt(remainingW),
                    this.BITS - bitOffset,
                );

                // Создаем маску: (1 << bits) - 1, затем сдвигаем на позицию X
                const mask = ((1n << bitsInThisSegment) - 1n) << bitOffset;

                // Если результат AND не равен 0 — место занято
                if ((currentRow[segmentIdx] & mask) !== 0n) return false;

                remainingW -= Number(bitsInThisSegment);
                currentX += Number(bitsInThisSegment);
            }
        }
        return true;
    }

    /**
     * Занять место
     */
    place(x: number, y: number, w: number, h: number): void {
        this.updateGrid(x, y, w, h, true);
    }

    /**
     * Освободить место
     */
    clear(x: number, y: number, w: number, h: number): void {
        this.updateGrid(x, y, w, h, false);
    }

    private updateGrid(
        x: number,
        y: number,
        w: number,
        h: number,
        fill: boolean,
    ): void {
        for (let rowOffset = 0; rowOffset < h; rowOffset++) {
            const currentRow = this.rows[y + rowOffset];
            let remainingW = w;
            let currentX = x;

            while (remainingW > 0) {
                const segmentIdx = Math.floor(currentX / Number(this.BITS));
                const bitOffset = BigInt(currentX % Number(this.BITS));
                const bitsInThisSegment = this.min(
                    BigInt(remainingW),
                    this.BITS - bitOffset,
                );
                const mask = ((1n << bitsInThisSegment) - 1n) << bitOffset;

                if (fill) {
                    currentRow[segmentIdx] |= mask; // Устанавливаем биты (OR)
                } else {
                    currentRow[segmentIdx] &= ~mask; // Сбрасываем биты (AND NOT)
                }

                remainingW -= Number(bitsInThisSegment);
                currentX += Number(bitsInThisSegment);
            }
        }
    }

    private min(a: bigint, b: bigint): bigint {
        return a < b ? a : b;
    }
}

// console.log(`cellX >= dropArea.startPos.x ${cellX}>=${dropArea.startPos.x} ${cellX >= dropArea.startPos.x}  \ncellX <= dropArea.endPos.x ${cellX} <= ${dropArea.endPos.x} ${cellX <= dropArea.endPos.x} \ncellY >= dropArea.startPos.y ${cellY} >= ${dropArea.startPos.y} ${cellY >= dropArea.startPos.y} \ncellY <= dropArea.endPos.y ${cellY} <= ${dropArea.endPos.y} ${cellY <= dropArea.endPos.y}`)
