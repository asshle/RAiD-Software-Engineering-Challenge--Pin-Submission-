
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button, Divider, TextField, CircularProgress } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getFruitItems } from './items';
import { submitOrder, type Order } from './orders';
import type { TicketItemProps } from './Materials';
 

interface CheckoutLocationState {
    cart: Record<string, number>;
}
 
interface CheckoutLineItem {
    itemID: string;
    name: string;
    price: number;
    qty: number;
    stock: number;
}
 
export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as CheckoutLocationState | undefined;
 
    // Local copy so qty can be adjusted on this page without needing global state.
    const [cart, setCart] = useState<Record<string, number>>(state?.cart ?? {});
    const [items, setItems] = useState<TicketItemProps[]>([]);       
    const [itemsLoading, setItemsLoading] = useState(true);
 
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

    useEffect(() => {                                                
        getFruitItems()
            .then(setItems)
            .catch((err) => console.error('Failed to load items:', err))
            .finally(() => setItemsLoading(false));
    }, []);
 
    const lineItems: CheckoutLineItem[] = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([itemID, qty]) => {
            const item = items.find((i) => String(i.itemID) === itemID);
            return {
                itemID,
                name: item?.name ?? 'Unknown item',
                price: item?.price ?? 0,
                qty,
                stock: item?.count ?? qty,
            };
        });
 
    const total = lineItems.reduce((sum, line) => sum + line.price * line.qty, 0);
    const totalItems = lineItems.reduce((sum, line) => sum + line.qty, 0);
 
    const adjustQty = (itemID: string, delta: number) => {
        setCart((prev) => {
            const stock = items.find((i) => i.itemID === itemID)?.count ?? Infinity;
            const nextQty = Math.min(stock, Math.max(0, (prev[itemID] ?? 0) + delta));
            return { ...prev, [itemID]: nextQty };
        });
    };
 
    const removeItem = (itemID: string) => {
        setCart((prev) => {
            const next = { ...prev };
            delete next[itemID];
            return next;
        });
    };
 
    const canSubmit = customerName.trim().length > 0 && address.trim().length > 0 && lineItems.length > 0;
 
    const handlePlaceOrder = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            const order = await submitOrder({
                customerName: customerName.trim(),
                address: address.trim(),
                lineItems: lineItems.map((line) => ({
                    itemID: line.itemID,
                    name: line.name,
                    qty: line.qty,
                    price: line.price,
                })),
                total,
            });
            setPlacedOrder(order);
        } finally {
            //alert("completed ")
            setSubmitting(false);
        }
    };

    if (itemsLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress sx={{ color: '#5B2333' }} />
        </Box>
    );
}

 
    if (placedOrder) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', gap: 1.5, px: 3, textAlign: 'center' }}>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 26 }}>
                    Order placed
                </Typography>
                <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 14, color: 'text.secondary' }}>
                    {placedOrder.orderID} · status: {placedOrder.status}
                </Typography>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'text.secondary', mt: 1 }}>
                    We'll deliver to {placedOrder.address}
                </Typography>
                <Button
                    onClick={() => navigate('/')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none', fontFamily: 'Georgia, serif', mt: 2 }}
                >
                    Back to store
                </Button>
            </Box>
        );
    }
 
    if (lineItems.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', gap: 2 }}>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700 }}>
                    Your cart is empty
                </Typography>
                <Button
                    onClick={() => navigate('/')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none', fontFamily: 'Georgia, serif' }}
                >
                    Back to store
                </Button>
            </Box>
        );
    }
 
    return (
        <Box sx={{ maxWidth: 640, mx: 'auto', px: 3, py: 6 }}>
            <Button
                onClick={() => navigate('/')}
                startIcon={<ArrowBackIcon />}
                sx={{ textTransform: 'none', fontFamily: 'Georgia, serif', mb: 3, pl: 0 }}
            >
                Back to store
            </Button>
 
            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 32, mb: 4 }}>
                Your cart
            </Typography>
 
            {lineItems.map((line) => (
                <Box key={line.itemID}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 17 }}>
                                {line.name}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 13, color: 'text.secondary' }}>
                                ${line.price.toFixed(2)} each
                            </Typography>
                        </Box>
 
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                    size="small"
                                    onClick={() => adjustQty(line.itemID, -1)}
                                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 28, height: 28 }}
                                >
                                    <RemoveIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                                <Typography sx={{ fontFamily: '"Courier New", monospace', width: 20, textAlign: 'center' }}>
                                    {line.qty}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => adjustQty(line.itemID, 1)}
                                    disabled={line.qty >= line.stock}
                                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 28, height: 28 }}
                                >
                                    <AddIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Box>
 
                            <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 15, minWidth: 56, textAlign: 'right' }}>
                                ${(line.price * line.qty).toFixed(2)}
                            </Typography>
 
                            <IconButton size="small" onClick={() => removeItem(line.itemID)}>
                                <DeleteIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider />
                </Box>
            ))}
 
            <TextField
                label="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                fullWidth
                sx={{ mt: 4 }}
            />
            <TextField
                label="Delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                sx={{ mt: 2 }}
            />
 
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 4, mb: 1 }}>
                <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 13, color: 'text.secondary' }}>
                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                </Typography>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 22 }}>
                    Total: ${total.toFixed(2)}
                </Typography>
            </Box>
 
            <Button
                fullWidth
                disabled={!canSubmit || submitting}
                onClick={handlePlaceOrder}
                sx={{
                    bgcolor: '#5B2333',
                    color: '#fff',
                    textTransform: 'none',
                    fontFamily: 'Georgia, serif',
                    fontSize: 16,
                    py: 1.5,
                    mt: 2,
                    borderRadius: 0,
                    '&:hover': { bgcolor: '#3E1722' },
                    '&.Mui-disabled': { bgcolor: '#EFECE1', color: 'text.disabled' },
                }}
            >
                {submitting ? 'Placing order…' : 'Place order'}
            </Button>
        </Box>
    );
}
 








