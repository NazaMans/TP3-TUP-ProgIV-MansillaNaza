import { useEffect,useState } from "react";
import { useAuth } from "../auth/auth";
import { useCallback } from "react";
import { Link } from "react-router";

export function TablaPacientes(){

    const {fetchAuth} = useAuth();

    const [pacientes, setPacientes] = useState([]);

    const fetchPacientes = useCallback(
        async () => {
            const response = await fetchAuth("http://localhost:3000/pacientes")
            const data = await response.json();

            if (!response.ok){
                console.log("Hubo un error: ", data.error);
                return;
            }

            console.log("Medicos: ", data);

            setPacientes(data.data);
        }, 
        [fetchAuth]
    )

    useEffect(() => {
        fetchPacientes();
    }, [fetchPacientes]);

    return (
        <article>
            <h2>Tabla de los pacientes</h2>
            <Link role="button" to="/pacientes/crear">
            Crear nuevo paciente
            </Link>
            <div className="group">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>DNI</th>
                            <th>Obra social</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((p) => (
                            <tr key={p.id}>

                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>{p.apellido}</td>
                                <td>{p.dni}</td>
                                <td>{p.obra_social}</td>
                                <td>
                                    <div>
                                        <Link role="button" to={`/pacientes/${p.id}`}>
                                         Ver
                                        </Link>
                                        <Link role="button" to={`/pacientes/${p.id}/modificar`}>
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