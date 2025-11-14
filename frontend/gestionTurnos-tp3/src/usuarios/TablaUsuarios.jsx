import { useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { useCallback } from "react";
import { Link } from "react-router";

export function TablaUsuarios(){


    const {fetchAuth} = useAuth();

    const [usuarios, setUsuarios] = useState([]);

    const fetchUsuarios = useCallback(
        async () =>{

            const response = await fetchAuth("http://localhost:3000/usuarios");
            const data = await response.json();

            if (!response.ok){
                console.log("Hubo un error: ", data.error);
                return;
            }

            console.log("Usuarios: ", data.usuarios);

            setUsuarios(data.usuarios)
        },
        [fetchAuth]
    );

    useEffect(() => {
        fetchUsuarios();
    },[fetchUsuarios]);

    const handleQuitar = async (id) => {
        if (window.confirm("¿Desea quitar este usuario posta?")){

            const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`,{
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok || !data.success){
                console.log("Hubo un error: ", data.error);
                return;
            }

            await fetchUsuarios();

        }
    }


    return (

        <article>
            <h2>Tabla de los usuarios</h2>
            <div className="group">
                <table>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th> 
                        <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nombre}</td>
                                <td>{u.apellido}</td>
                                <td>{u.email}</td>
                                <td>
                                    <div>
                                        <Link role="button" to= {`/usuarios/${u.id}`}>
                                        Ver
                                        </Link>
                                        <Link role="button" to={`/usuarios/${u.id}/modificar`}>
                                        Modificar
                                        </Link>
                                        <button onClick={() => handleQuitar(u.id)}>Quitar</button>
                                        
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> 

            </div>
        </article>

    );
}