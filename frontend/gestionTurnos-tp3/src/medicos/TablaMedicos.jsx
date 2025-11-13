import { useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { useCallback } from "react";
import { Link } from "react-router";

export function TablaMedicos(){

    const {fetchAuth} = useAuth();

    const [medicos, setMedicos] = useState([]);

    const fetchMedicos = useCallback(
        async () =>{
            const response = await fetchAuth("http://localhost:3000/medicos");
            const data = await response.json();

            if (!response.ok){
                console.log("Hubo un error: ", data.error);
                return;
            }

            console.log("Medicos: ", data);

            setMedicos(data.data);
        },
        [fetchAuth]
    )

    useEffect(() => {
        fetchMedicos();
    },[fetchMedicos]);

    return (
        <article>
            <h2>Tabla de los medicos</h2>
            <Link role="button" to="/medicos/crear">
            Crear nuevo usuario
            </Link>
            <div className="group">
                <table>
                   <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Especialidad</th>
                        <th>Matricula profesional</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                        {medicos.map((m) => (
                            <tr key={m.id}>
                                <td>{m.id}</td>
                                <td>{m.nombre}</td>
                                <td>{m.apellido}</td>
                                <td>{m.especialidad}</td>
                                <td>{m.matricula_profesional}</td>
                                <td>
                                    <div>
                                        <Link role="button" to={`/usuarios/${m.id}`}>
                                        Ver
                                        </Link>
                                        <Link role="button" to={`/usuarios/${m.id}/modificar`}>
                                        Modificar
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody> 
                </table>
            </div>
        </article>
    )


}