import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LandingPage from './landingPage.tsx'
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
 //load page segments in here
  return (
    <>
      <CssBaseline />
      <Outlet /> 
    </>
  )
}

export default App
