import { Namespace } from "../../consts";
import { useAppSelector } from "../../hooks";

//export const getShopItems = (state: Pick<RootState, typeof Namespace.item>): ShopItem[] => state[Namespace.item].shopItems;
export const getShop = () => useAppSelector(state => state[Namespace.shop]);