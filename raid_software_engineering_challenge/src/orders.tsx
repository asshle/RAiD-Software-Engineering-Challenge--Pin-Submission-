import { API_BASE_URL } from './main'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
 
export interface OrderLineItem {
    itemID: string;
    name: string;
    qty: number;
    price: number;
}
 
export interface NewOrder {
    customerName: string;
    address: string;
    lineItems: OrderLineItem[];
    total: number;
}
 
export interface Order extends NewOrder {
    orderID: string;
    status: OrderStatus;
    createdAt: string;
}
 
 
export async function getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/api/getAllOrders`);

    if (!response.ok) {
        throw new Error(`Failed to load orders (${response.status})`);
    }

    const raw = await response.json();

    return raw.map((order: any) => ({
        orderID: order.orderID,
        customerName: order.customerName,
        address: order.address,
        lineItems: order.lineItems,
        total: order.totalCost ?? order.total ?? 0,
        status: order.status ?? order.orderStatus ?? 'pending',
        createdAt: order.createdAt ?? '',
    }));
}

export async function submitOrder(order: NewOrder): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/api/submitOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? `Order submission failed (${response.status})`);
    }

    const saved = await response.json();

    return {
        customerName: saved.customerName,
        address: saved.address,
        lineItems: saved.lineItems,
        total: saved.total ?? order.total,
        orderID: saved.orderID,
        status: saved.status ?? 'pending',
        createdAt: saved.createdAt ?? new Date().toISOString(),
    };
}




















