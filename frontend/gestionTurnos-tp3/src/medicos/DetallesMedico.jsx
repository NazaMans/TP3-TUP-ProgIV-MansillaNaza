import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { useParams } from "react-router";

export const DetallesMedico = () => {
    const {fetchAuth} = useAuth();
    const {id} = useParams();
    const [medico, setMedico] = useState(null);

    const fetchMedico = useCallback( async () => {
        const response = await fetchAuth(`http://localhost:3000/medicos/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success){
            console.log("Hubo un error: ", data.error);
            return;
        }

        setMedico(data.medico);
    },[fetchAuth,id]);

    useEffect(() => {
        fetchMedico();
    },[fetchMedico]);

    if (!medico){
        return null;
    }

    return ( 
        <article>
            <h2>Detalles del medico</h2>
            <h3>Nombre: {medico.nombre}</h3>
            <h3>Apellido: {medico.apellido}</h3>
            <h3>Especialidad: {medico.especialidad}</h3>
            <h3>Matricula profesional: {medico.matricula_profesional}</h3>
        </article>
    )


}