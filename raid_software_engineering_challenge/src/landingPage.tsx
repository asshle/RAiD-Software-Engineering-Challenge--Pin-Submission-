
import { AppBar, Toolbar, Typography, Drawer, Box, Button, Fab, Badge, IconButton } from '@mui/material';
import * as icons from '@mui/icons-material'
import * as  Mat from './Materials.tsx';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import * as assets from './assets/FruitIcons';
import { useNavigate } from 'react-router-dom';
import { getFruitItems } from './items.tsx';
import type { TicketItemProps } from './Materials';
import './App.css'




//const items: Mat.TicketItemProps[] = getFruitItems(); // getFruitItems() is a placeholder for now, but will be replaced with a real GET request to the server later

interface HeroSectionProps {
    eyebrow?: string;
    heading?: string;
    subtext?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

function HeroSection({
    eyebrow = "ONLINE FARM STAND · PACKED SAME DAY",
    heading = "Fruit, sold honestly.",
    subtext = "No middlemen, no markup games. Just today's crate, priced plainly and delivered to your door.",
    primaryCtaLabel = "Browse today's crate",
    onPrimaryClick,
    onSecondaryClick,
}: HeroSectionProps) {
    return (
        <Box sx={{ maxWidth: 480, px: 2 }}>
            {/* Eyebrow label */}
            <Typography
                sx={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    mb: 2,
                }}
            >
                {eyebrow}
            </Typography>
 
            {/* Heading */}
            <Typography
                sx={{
                    fontFamily: 'Georgia, serif',
                    fontWeight: 700,
                    fontSize: { xs: 40, sm: 48 },
                    lineHeight: 1.1,
                    color: 'text.primary',
                    mb: 3,
                }}
            >
                {heading}
            </Typography>
 
            {/* Subtext */}
            <Typography
                sx={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: 'text.secondary',
                    mb: 4,
                    maxWidth: 380,
                }}
            >
                {subtext}
            </Typography>
 
            {/* CTAs */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Button
                    fullWidth
                    onClick={onPrimaryClick}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        bgcolor: '#5B2333',
                        color: '#fff',
                        textTransform: 'none',
                        fontFamily: 'Georgia, serif',
                        fontSize: 15,
                        px: 3,
                        py: 1.5,
                        borderRadius: 0.5,
                        '&:hover': { bgcolor: '#3E1722' },
                    }}
                >
                    {primaryCtaLabel}
                </Button>

            </Box>
        </Box>
    );
}
 
interface ProductGridSectionProps {
    eyebrow?: string;
    heading?: string;
    items: Mat.TicketItemProps[];
    onAdd?: (itemID: string, qty: number) => void;
}
export function ProductGridSection({
    eyebrow = 'AVAILABLE NOW',
    heading = "Today's crate",
    items,
    onAdd,
}: ProductGridSectionProps) {
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 6 }}>
            <Typography
                sx={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    mb: 1,
                }}
            >
                {eyebrow}
            </Typography>
            <Typography
                sx={{
                    fontFamily: 'Georgia, serif',
                    fontWeight: 700,
                    fontSize: 32,
                    color: 'text.primary',
                    mb: 4,
                }}
            >
                {heading}
            </Typography>
 
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                }}
            >
               {items.map((item) => (
                    <Mat.FruitCard key={item.itemID} item={item} onAdd={onAdd} />
            ))}
            </Box>
        </Box>
    );
}
interface CartItems {
    itemID: string;
    qty: number;
}
export default function LandingPage() {

    const navigate = useNavigate();
    const [cart, setCart] = useState<Record<string, number>>({});
    const [items, setItems] = useState<TicketItemProps[]>([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    
      useEffect(() => {
        getFruitItems()
            .then(setItems)
            .catch((err) => console.error('Failed to load items:', err))
            .finally(() => setItemsLoading(false));
    }, []); // runs once, on mount fetches the inventory

    
    const handleAdd = (itemID: string, qty: number) => { // event handler for adding CartItems to the cart
        setCart((prev) => ({
            ...prev,
            [itemID]: (prev[itemID] ?? 0) + qty,
        }));
        //console.log('Cart:', { ...cart, [itemID]: (cart[itemID] ?? 0) + qty }); // temp, for sanity-checking in devtools
        const item = items.find((item) => item.itemID === itemID);
        
        //alert( `${item?.name} added to cart: ${qty}` );
    };
   
    useEffect(() => {
        // Fetch data from the server and update the items state
        console.log('cart changed:', cart);
    },[cart]);
     
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh',flexGrow: 1,width: '100%'}}>
            {/* appBar equivalent */}
            <AppBar position="static" sx={{ bgcolor: '#EFECE1', color: 'text.primary', boxShadow: 'none' }}>
                <Toolbar>
                    <IconButton  onClick={() => { 
                        console.log('Navigating to cart with state:', { cart, items });
                        navigate('/cart', { state: { cart } })
                        }}>
                        <Badge badgeContent={totalItems} color="error">
                            <ShoppingCartIcon sx={{ color: 'text.primary' }} />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* drawer equivalent */}
            {/*<Drawer variant="permanent" anchor="left">
                {/* nav items 
            </Drawer> */}

            {/* body equivalent */}
            <center>
                <Box sx={{ padding: 2 }}/> 
                <HeroSection 
                    onPrimaryClick={() => {
                       //alert("Redirect to store page");
                    }}  
                
                />
                <Box sx={{ padding: 2 }}/> 
                <Mat.TicketPaper pageBg="grey" cardBg="#EFECE1" maxWidth="50%" items={items} />
                <Box sx={{ padding: 2 }}/> 
                <ProductGridSection items={items} onAdd={handleAdd} />
            </center>
            
        </Box>
    );
}

