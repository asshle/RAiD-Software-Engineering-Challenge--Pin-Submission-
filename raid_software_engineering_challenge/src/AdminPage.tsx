import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Divider, Chip, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getFruitItems } from './items';
import { getAllOrders, type Order, type OrderStatus } from './orders';
import type { TicketItemProps } from './Materials';

const LOW_STOCK_THRESHOLD = 10;

const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: '#B5541F',
    confirmed: '#5B2333',
    preparing: '#5B2333',
    out_for_delivery: '#3F6B4A',
    delivered: '#3F6B4A',
    cancelled: '#8a8578',
};

export default function AdminPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<TicketItemProps[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = () => {
        setLoading(true);
        setError(null);
        Promise.all([getFruitItems(), getAllOrders()])
            .then(([fetchedItems, fetchedOrders]) => {
                setItems(fetchedItems);
                setOrders(fetchedOrders);
            })
            .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard data'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const lowStockItems = items.filter((item) => item.count < LOW_STOCK_THRESHOLD);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: '#5B2333' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    onClick={() => navigate('/')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none', fontFamily: 'Georgia, serif', pl: 0 }}
                >
                    Back to store
                </Button>
                <Button
                    onClick={loadData}
                    startIcon={<RefreshIcon />}
                    sx={{ textTransform: 'none', fontFamily: 'Georgia, serif', color: 'text.secondary' }}
                >
                    Refresh
                </Button>
            </Box>

            <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
                Store owner
            </Typography>
            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 32, mb: 4 }}>
                Dashboard
            </Typography>

            {error && (
                <Typography sx={{ color: '#B5541F', fontFamily: 'Georgia, serif', mb: 3 }}>
                    {error}
                </Typography>
            )}

            {/* Stat strip */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', border: '1px solid', borderColor: 'divider', mb: 6 }}>
                {[
                    { label: 'Orders', value: String(orders.length) },
                    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}` },
                    { label: 'Fruits listed', value: String(items.length) },
                    { label: 'Low stock', value: String(lowStockItems.length) },
                ].map((stat, i) => (
                    <Box
                        key={stat.label}
                        sx={{ flex: '1 1 160px', px: 3, py: 2.5, borderLeft: i > 0 ? '1px dashed' : 'none', borderColor: 'divider' }}
                    >
                        <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary', mb: 0.5 }}>
                            {stat.label}
                        </Typography>
                        <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 24 }}>
                            {stat.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Inventory */}
            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 22, mb: 2 }}>
                Inventory
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', mb: 6 }}>
                <Box sx={{ display: 'flex', px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ flex: 2, fontFamily: '"Courier New", monospace', fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Fruit</Typography>
                    <Typography sx={{ flex: 1, fontFamily: '"Courier New", monospace', fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Price</Typography>
                    <Typography sx={{ flex: 1, fontFamily: '"Courier New", monospace', fontSize: 12, textTransform: 'uppercase', color: 'text.secondary' }}>Stock</Typography>
                </Box>
                {items.length === 0 && (
                    <Typography sx={{ px: 2.5, py: 3, color: 'text.secondary', fontFamily: 'Georgia, serif' }}>No inventory found.</Typography>
                )}
                {items.map((item, i) => (
                    <Box
                        key={item.itemID}
                        sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 1.5, borderBottom: i < items.length - 1 ? '1px dashed' : 'none', borderColor: 'divider' }}
                    >
                        <Typography sx={{ flex: 2, fontFamily: 'Georgia, serif', fontWeight: 600 }}>{item.name}</Typography>
                        <Typography sx={{ flex: 1, fontFamily: '"Courier New", monospace' }}>${item.price.toFixed(2)}</Typography>
                        <Typography
                            sx={{
                                flex: 1,
                                fontFamily: '"Courier New", monospace',
                                color: item.count < LOW_STOCK_THRESHOLD ? '#B5541F' : 'text.primary',
                                fontWeight: item.count < LOW_STOCK_THRESHOLD ? 700 : 400,
                            }}
                        >
                            {item.count} {item.count < LOW_STOCK_THRESHOLD && '⚠'}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Orders */}
            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 22, mb: 2 }}>
                Orders
            </Typography>
            {orders.length === 0 && (
                <Typography sx={{ color: 'text.secondary', fontFamily: 'Georgia, serif' }}>No orders yet.</Typography>
            )}
            {orders.map((order) => (
                <Box key={order.orderID} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 16 }}>
                                {order.customerName}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 12, color: 'text.secondary' }}>
                                {order.orderID} · {order.address}
                            </Typography>
                        </Box>
                        <Chip
                            label={order.status.replace(/_/g, ' ')}
                            size="small"
                            sx={{
                                bgcolor: STATUS_COLORS[order.status] ?? '#8a8578',
                                color: '#fff',
                                textTransform: 'capitalize',
                                fontFamily: '"Courier New", monospace',
                            }}
                        />
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    {order.lineItems?.map((line) => (
                        <Box key={line.itemID} sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"Courier New", monospace', fontSize: 13, color: 'text.secondary', py: 0.25 }}>
                            <span>{line.name} × {line.qty}</span>
                            <span>${(line.price * line.qty).toFixed(2)}</span>
                        </Box>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                            Total: ${order.total.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
