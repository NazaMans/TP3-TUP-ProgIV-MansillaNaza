import { Outlet, Link } from "react-router";
import { useAuth } from "../auth/auth";
import Ingresar from "../Ingresar/ingresar";
import { Registrar } from "../Ingresar/Registrar";

function Layout() {

    const {isAuthenticated, logout} = useAuth();

  return (
    <main>

        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/medicos">Medicos</Link>
                </li>
                <li>
                    <Link to="/pacientes">Pacientes</Link>
                </li>
                <li>
                    <Link to="/turnos">Turnos</Link>
                </li>
                <li>
                    <Link to="/usuarios">Usuarios</Link>
                </li>
            </ul>
            <li>
                {isAuthenticated ? (
                    <button onClick={() => logout}>Cerrar sesion</button>
                ) : (
                    <Ingresar />
                )}
            </li>
            <li>
                {!isAuthenticated && 
                    <Registrar/>
                 }
            </li>
        </nav>
        <Outlet/>
    </main>
  )
}

export default Layout