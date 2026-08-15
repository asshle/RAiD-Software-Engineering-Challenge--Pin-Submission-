import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { API_BASE_URL } from './main';

async function loginAsAdmin(email: string, password: string): Promise<{ success: boolean }> {

    const uri = API_BASE_URL+'/api/login'
    console.log(uri);
    const response = await fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        return { success: false };
    }
    //console.log(response.json())
    return response.json();
}

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = email.trim().length > 0 && password.length > 0;

    const handleLogin = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        setError(null);
        try {
            const result = await loginAsAdmin(email.trim(), password);
            if (result.success) {
                navigate('/admin'); // route to admin page here 
            } else {
                setError('Incorrect email or password.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', px: 3 }}>
            <Box sx={{ width: '100%', maxWidth: 380 }}>
                <Button
                    onClick={() => navigate('/')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none', fontFamily: 'Georgia, serif', mb: 3, pl: 0 }}
                >
                    Back to store
                </Button>

                <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
                    Store owner
                </Typography>
                <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 30, mb: 4 }}>
                    Admin login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />

                <Button
                    fullWidth
                    disabled={!canSubmit || submitting}
                    onClick={handleLogin}
                    sx={{
                        bgcolor: '#5B2333',
                        color: '#fff',
                        textTransform: 'none',
                        fontFamily: 'Georgia, serif',
                        fontSize: 16,
                        py: 1.5,
                        borderRadius: 0,
                        '&:hover': { bgcolor: '#3E1722' },
                        '&.Mui-disabled': { bgcolor: '#EFECE1', color: 'text.disabled' },
                    }}
                >
                    {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
            </Box>
        </Box>
    );
}
