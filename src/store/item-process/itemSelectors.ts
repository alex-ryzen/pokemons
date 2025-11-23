import { Namespace } from "../../consts";
import { useAppSelector } from "../../hooks";
import { ShopItem } from "../../types/app";
import { RootState } from "../store";

//export const getShopItems = (state: Pick<RootState, typeof Namespace.item>): ShopItem[] => state[Namespace.item].shopItems;
export const getShopItems = () => useAppSelector(state => state[Namespace.item]).shopItems;