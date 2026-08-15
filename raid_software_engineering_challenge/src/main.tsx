import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import LandingPage from './landingPage.tsx'
import CheckoutPage from './CheckoutPage';
import AdminLoginPage from './AdminLoginPage';
import AdminPage from './AdminPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
            <Routes>
                <Route element={<App />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/cart" element={<CheckoutPage />} />
                    <Route path="/adminlogin" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
