import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home';
import './index.css'
import "@picocss/pico";
import { AuthPage, AuthProvider } from './auth/auth';
import {BrowserRouter, Route, Routes } from "react-router";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
