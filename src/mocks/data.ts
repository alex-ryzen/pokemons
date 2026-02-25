import { CharacteristicProps } from "../components/UI/Characteristic/Characteristic";
import { EntityCardProps } from "../components/UI/EntityCard/EntityCard";
import { ItemCardProps } from "../components/UI/ItemCard/ItemCard";
import { AuthState } from "../store/auth-process/auth-process";
import { IBerry, IGardenService, IItem, IPlayer, IShopItem, IUser, UserRoles } from "../types/app";
//import {v4 as uuidv4} from 'uuid'

export const initAuth: AuthState = {
    accessToken: "some-token",
    isAuth: true,
}

export const initInventoryItems: IItem[] = [
    {
        id: "item1",
        itemId: "item1",
        gridId: "inv",
        category: "berry",
        cSize: 2,
        cPosX: 3,
        cPosY: 1,
        image: "/images/items/someberry.png",
    },
    {
        id: "item2",
        itemId: "item2",
        gridId: "inv",
        category: "pokeball",
        cSize: 1,
        cPosX: 0,
        cPosY: 0,
        image: "/images/items/Vpokeball.png",
    },
    {
        id: "item3",
        itemId: "item3",
        gridId: "inv",
        category: "pokeball",
        cSize: 1,
        cPosX: 2,
        cPosY: 1,
        image: "/images/items/Ypokeball.png",
    },
];

export const initGardenItems: IBerry[] = [
    {
        id: "item4",
        itemId: "item4",
        gridId: "grdn",
        category: "pokeball",
        cSize: 1,
        cPosX: 3,
        cPosY: 4,
        isGrowing: true,
        bonus: 100,
        growStart: new Date().getDate().toLocaleString(),
        growthTime: 1000000,
        currentSize: 1,
        grownSize: 2,
        image: "/images/items/Ypokeball.png",
    },
]

export const initServices: Partial<IGardenService>[] = [
    {
        title: "Увеличить площадь грядки",
        price: 1000
    },
    {
        title: "Ускорить рост на 2%/час на 2 часа",
        price: 2000
    },
    {
        title: "Ускорить рост на 5%/час на 2 часа",
        price: 5000
    },
]

export const initUserPlayer: IUser & IPlayer = {
    user_id: 7,
    uuid: "123123",
    username: "admin",
    fullname: "ADMIN ADMONOVICH ADMINOV",
    email: "adminos@gmail.com",
    regdate: new Date().getDate().toLocaleString(), //"2026-03-20"
    image: undefined,
    role: UserRoles.User,
    
    player_id: 7,
    balance: "100000",
    total_income: "100",
    inventory_size: 15,
    inventory_extention_price: "1000",
}

export const initShopItems: IShopItem[] = [
    {
        item_id: "item1",
        item_type: "pokeball",
        category: "pokeball-default",
        name: "master-ball",
        price: "1000",
        level: 1,
        specs: {chance: '70'},
        description: "kaif sharik",
        image: "/images/items/Vpokeball.png",
    },
    {
        item_id: "item2",
        item_type: "berry",
        category: "berry-default",
        name: "master-berry",
        price: "2000",
        level: 2,
        specs: undefined,
        description: "kaif yagodka",
        image: "/images/items/someberry.png",
    }
]

export const initStats: Array<CharacteristicProps> = [
    {name: "Вид", value: "clefairy"},
    {name: "Вес", value: "12 кг"},
    {name: "Суммарно заработано", value: "11 200"},
    {name: "Денег/сек", value: "1.1"},
    {name: "Возраст", value: "1 день"},
]

export const initEntities: Omit<EntityCardProps, 'onOpen'>[] = Array.from({length: 6}, (_, _idx) => ({
    id: "tt1-ee2-ss3-tt4",
    title: "clefairy",
    properties: [
        {name: "Вес", value: `${12} кг`},
        {name: "Денег/сек", value: 1.1}
    ],
    img: "/images/items/clefairy.png",
}))

export const initPokemonFood: ItemCardProps[] = [
    {
        title: "Ягода 1 уровня",
        description: "Накорми ей покемона для увеличения веса на 0.1 кг",
        buttonTxt: "Накормить",
        img: "/images/items/someberry.png", 
    },
    {
        title: "Ягода 1 уровня",
        description: "Накорми ей покемона для увеличения веса на 0.1 кг",
        buttonTxt: "Накормить",
        img: "/images/items/someberry.png", 
    },
    {
        title: "Ягода 1 уровня",
        description: "Накорми ей покемона для увеличения веса на 0.1 кг",
        buttonTxt: "Накормить",
        img: "/images/items/someberry.png", 
    }
]