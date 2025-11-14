import { useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { useCallback } from "react";
import { Link } from "react-router";

export function TablaTurnos(){

    const {fetchAuth} = useAuth([]);

    const [turnos, setTurnos] = useState([]);


    const fetchTurnos = useCallback(
        async () => {
            const response = await fetchAuth("http://localhost:3000/turnos");
            const data = await response.json();

            if(!response.ok){
                console.log("hubo un error: ", data.error);
                return;
            }

            console.log("Turnos: ", data);

            setTurnos(data.data);
        },
        [fetchAuth]
    )

    useEffect(() => {
        fetchTurnos();
    }, [fetchTurnos]);


    return (
        <article>
            

            <h2>Tabla de turnos</h2>
            <Link role="button" to="/turnos/crear">
            Crear nuevo turno
            </Link>
            
            <div className="group">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Paciente</th>
                            <th>Medico</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.map((t) => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.nombre_paciente}</td>
                                <td>{t.nombre_medico}</td>
                                <td>{t.fecha}</td>
                                <td>{t.hora}</td>
                                <td>{t.estado}</td>
                                <td>
                                    <div>
                                        <Link role="button" to={`/turnos/${t.id}`}>
                                        Ver
                                        </Link>
                                        <Link role="button" to={`/turnos/${t.id}/modificar`}>
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