import { STATIC_URL } from "../consts";
import { GeneralType, IDTYPE} from "../types/app";

export function mapping<T extends GeneralType>(array: T[]): Record<IDTYPE, T> {
    return array.reduce<Record<string, T>>((acc, elem) => {
        acc[elem.id] = elem;
        return acc;
    }, {});
}

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export function returnByKey<T>(key: keyof T, obj: T) {
    return obj[key];
}

export function resolveImageUrl(
    path: string | null | undefined
): string | undefined {
    if (!path) return undefined;
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    if (path.startsWith("./")) {
        const clean = path.slice(1);
        return STATIC_URL.replace(/\/+$/, "") + clean;
    }
    if (path.startsWith("/")) {
        return STATIC_URL.replace(/\/+$/, "") + path;
    }
    return STATIC_URL.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}
