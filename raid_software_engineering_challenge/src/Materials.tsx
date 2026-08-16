import { useState } from 'react'

import { Box, Typography, Card,CardContent, IconButton, Button } from '@mui/material';
import * as icons from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { FruitIconComponent } from './assets/FruitIcons';
import type { ReactNode } from 'react';


interface MaterialCardProps {
    icons: icons.SvgIconComponent;
    title: string;
    textColor: string;

}

export interface TicketItemProps{
    itemID: string;
    icon?: FruitIconComponent;
    name: string;
    count: number;
    price: number;
    color:string;
}

interface TicketPaperProps {
    items: TicketItemProps[];
    pageBg?: string;   // must match the background color behind this component, for the scallop illusion
    cardBg?: string;
    maxWidth?: number | string;
}

export interface FruitCardProps {
    item: TicketItemProps;
    onAdd?: (itemID: string, qty: number) => void;
}

export function MaterialCard({
    icons: IconsComponent, 
    title: title,
    textColor: textColor}: MaterialCardProps) {
    const [count, setCount] = useState(0)
    return (
        <Box 
            sx={{ display: 'flex'}}>
            <Card 
                sx={{ 
                    maxWidth:400,
                    minWidth: 200, 
                    maxHeight: 100, 
                    minHeight: 50, 
                    bgcolor: '#fef3e2'
                }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconsComponent sx={{ color: 'orange' }} />
                    <Typography gutterBottom sx={{ color: textColor, fontSize: 14 }}>
                        Word of the Day
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}


export function TicketPaper({
    items,
    pageBg = '#FAFAF6',
    cardBg = '#EFECE1',
    maxWidth = 420,
}: TicketPaperProps) {
    return (
        <Card
            elevation={0}
            sx={{
                position: 'relative',
                maxWidth,
                width: '100%',
                bgcolor: cardBg,
                border: '1px solid #E0DBCB',
                borderRadius: 0,
                boxShadow: 'none',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: -8,
                    height: 16,
                    backgroundImage: `radial-gradient(circle at 10px 8px, ${pageBg} 8px, transparent 8.5px)`,
                    backgroundSize: '20px 16px',
                    backgroundRepeat: 'repeat-x',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -8,
                    height: 16,
                    backgroundImage: `radial-gradient(circle at 10px 8px, ${pageBg} 8px, transparent 8.5px)`,
                    backgroundSize: '20px 16px',
                    backgroundRepeat: 'repeat-x',
                    transform: 'rotate(180deg)',
                },
            }}
        >  
            <CardContent sx={{ px: 4, py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography sx={{ fontFamily: 'Georgia, serif' ,fontSize: 27, fontWeight: 'bold' }} >Name</Typography>
                    <Typography sx={{ fontFamily: 'Georgia, serif' ,fontSize: 27, fontWeight: 'bold' }}> Count </Typography>
                    <Typography sx={{ fontFamily: 'Georgia, serif' ,fontSize: 27, fontWeight: 'bold' }}> Price</Typography>
                </Box>
                {items.map((item) => (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Typography sx={{ fontFamily: 'Georgia, serif' }} >{item.name}</Typography>
                        <Typography sx={{ fontFamily: 'Georgia, serif' }}>{item.count.toFixed(1)} unit </Typography>
                        <Typography sx={{ fontFamily: 'Georgia, serif' }}>${item.price.toFixed(2)}</Typography>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}

export function FruitCard({ item, onAdd }: FruitCardProps) {
    const [qty, setQty] = useState(1);
    const [addedSoFar, setAddedSoFar] = useState(0);
    const { icon: IconComponent} = item;

    const remaining = item.count - addedSoFar;

    const handleAddClick = () => {   // renamed — this card's own click handler
        onAdd?.(item.itemID, qty);    // calls LandingPage's real handleAdd, via the prop
        setAddedSoFar((prev) => prev + qty);
        setQty(1);
    };
 
    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                boxShadow: 'none',
                p: 3,
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: item.color,
                    mb: 3,
                }}
            >
                {IconComponent && <IconComponent color={item.color} />}
            </Box>
 
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 18 }}>
                    {item.name}
                </Typography>
                <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 16 }}>
                    ${item.price.toFixed(2)}
                </Typography>
            </Box>
 
            <Typography
                sx={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 13,
                    color: item.count > 10 ? 'success.main' : 'warning.main',
                    mb: 3,
                }}
            >
                {item.count} lbs in stock
            </Typography>
 
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 0}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 28, height: 28 }}
                    >
                        <RemoveIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <Typography sx={{ fontFamily: '"Courier New", monospace', width: 20, textAlign: 'center' }}>
                        {qty}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setQty((q) => q + 1)}
                        disabled={qty >= item.count}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 28, height: 28 }}
                    >
                        <AddIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </Box>
 
                <Button
                    onClick={handleAddClick}
                    disabled={remaining <= 0 || qty > remaining}
                    sx={{
                        bgcolor: '#5B2333',
                        color: '#fff',
                        textTransform: 'none',
                        fontFamily: 'Georgia, serif',
                        borderRadius: 0,
                        px: 2.5,
                        '&:hover': { bgcolor: '#3E1722' },
                    }}
                >
                   {remaining <= 0 ? 'Sold out' : 'Add'}
                </Button>
            </Box>
        </Card>
    );
}

 