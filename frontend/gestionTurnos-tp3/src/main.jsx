import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home';
import './index.css'
import "@picocss/pico";
import { AuthPage, AuthProvider } from './auth/auth';
import {BrowserRouter, Route, Routes } from "react-router";
import Layout from './layout/Layout';
import { TablaUsuarios } from './usuarios/TablaUsuarios';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route
        path="usuarios"
        element={
          <AuthPage>
           <TablaUsuarios/>
          </AuthPage>
        } />

        </Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
