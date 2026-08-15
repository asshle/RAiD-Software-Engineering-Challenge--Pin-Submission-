import * as assets from './assets/FruitIcons';
import type { TicketItemProps } from './Materials';
import { API_BASE_URL } from './main'
 
//const API_BASE_URL = m.API_BASE_URL;
 
//!TODO: Replace this with a real GET request to the server later
export function getFruitItemsStatic(): TicketItemProps[] {
    return [
        { itemID: '1', name: 'Apple', count: 30, price: 1.0, icon: assets.AppleIcon, color: 'black' },
        { itemID: '2', name: 'Orange', count: 25, price: 1.5, icon: assets.OrangeIcon, color: 'black' },
        { itemID: '3', name: 'Banana', count: 40, price: 2.0, icon: assets.BananaIcon, color: 'black' },
        { itemID: '4', name: 'Grape', count: 35, price: 2.5, icon: assets.GrapeIcon, color: 'black' },
        { itemID: '5', name: 'Blueberry', count: 40, price: 2.0, icon: assets.BlueberryIcon, color: 'black' },
 
 
    ];
}

// Maps the icon NAME stored in MongoDB (a plain string) back to the real component.
const ICON_MAP: Record<string, assets.FruitIconComponent> = {
    AppleIcon: assets.AppleIcon,
    OrangeIcon: assets.OrangeIcon,
    BananaIcon: assets.BananaIcon,
    GrapeIcon: assets.GrapeIcon,
    StrawberryIcon: assets.StrawberryIcon,
    WatermelonIcon: assets.WatermelonIcon,
    PineappleIcon: assets.PineappleIcon,
    MangoIcon: assets.MangoIcon,
    CherryIcon: assets.CherryIcon,
    LemonIcon: assets.LemonIcon,
    PeachIcon: assets.PeachIcon,
    PearIcon: assets.PearIcon,
    KiwiIcon: assets.KiwiIcon,
    PlumIcon: assets.PlumIcon,
    BlueberryIcon: assets.BlueberryIcon,
};
 
interface RawFruitItem {
    itemID: string | number;
    name: string;
    count: number;
    price: number;
    icon: string;
    color: string;
}

export async function getFruitItems(): Promise<TicketItemProps[]> {
    const response = await fetch(`${API_BASE_URL}/api/getInventoryCustomer`);
 
    if (!response.ok) {
        throw new Error(`Failed to load inventory (${response.status})`);
    }
 
    const raw: RawFruitItem[] = await response.json();
 
    return raw.map((item) => ({
        ...item,
        itemID: String(item.itemID),
        icon: ICON_MAP[item.icon],
    }));
}