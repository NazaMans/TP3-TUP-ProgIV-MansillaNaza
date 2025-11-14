import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home';
import './index.css'
import "@picocss/pico";
import { AuthPage, AuthProvider } from './auth/auth';
import {BrowserRouter, Route, Routes } from "react-router";
import Layout from './layout/Layout';
import { TablaUsuarios } from './usuarios/TablaUsuarios';
import { TablaMedicos } from './medicos/TablaMedicos';
import { TablaTurnos } from './turnos/TablaTurnos';
import { TablaPacientes } from './pacientes/TablaPacientes';
import { ModificarTurno } from './turnos/ModificarTurno';
import { CargarTurno } from './turnos/CargarTurno';
import {DetallesTurno} from './turnos/DetallesTurno';
import { CargarPaciente } from './pacientes/CargarPaciente';
import { ModificarPaciente } from './pacientes/ModificarPaciente';
import { CargarMedico } from './medicos/CargarMedico';
import { ModificarMedico } from './medicos/ModificarMedico';


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

        

        <Route
        path="medicos"
        element={
          <AuthPage>
            <TablaMedicos/>
          </AuthPage>
        }
        />

        <Route
        path="medicos/crear"
        element={
          <AuthPage>
            <CargarMedico/>
          </AuthPage>
        }
        />

        <Route
        path="medicos/:id/modificar"
        element={
          <AuthPage>
            <ModificarMedico/>
          </AuthPage>
        }
        />

        <Route
        path='pacientes'
        element={
          <AuthPage>
            <TablaPacientes/>
          </AuthPage>
        }/>

        <Route
        path="pacientes/crear"
        element={
          <AuthPage>
           <CargarPaciente/>
          </AuthPage>
        } />

        <Route
        path="pacientes/:id/modificar"
        element={
          <AuthPage>
           <ModificarPaciente/>
          </AuthPage>
        } />


        <Route
        path="turnos"
        element={
          <AuthPage>
            <TablaTurnos/>
          </AuthPage>
        }
        />

        <Route 
        path="/turnos/:id"
        element= {
          <AuthPage>
            <DetallesTurno/>
          </AuthPage>
        }
        />

        <Route
        path="turnos/crear"
        element= {
          <AuthPage>
            <CargarTurno/>
          </AuthPage>
        }
        />

        <Route
        path="/turnos/:id/modificar"
        element= {
          <AuthPage>
            <ModificarTurno/>
          </AuthPage>
        }/>


        </Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
