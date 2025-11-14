import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { useParams } from "react-router";

export const DetallesPaciente = () => {
    const {fetchAuth} = useAuth();
    const {id} = useParams();
    const [paciente, setPaciente] = useState(null);

    const fetchPaciente = useCallback( async () => {
        const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`);
        const data = await response.json();
        if (!response.ok || !data.success){
            console.log("Hubo un error: ", data.error);
            return;
        }

        console.log("Paciente solo: ", data.data)

        setPaciente(data.data);
    },[fetchAuth,id]);

    useEffect(() => {
        fetchPaciente();
    },[fetchPaciente]);

    if (!paciente){
        return null;
    }


    return (
    <article>
        <h2>Detalles del paciente</h2>
        <h3>Nombre: {paciente.nombre}</h3>
        <h3>Apellido: {paciente.apellido}</h3>
        <h3>DNI: {paciente.dni}</h3>
        <h3>Obra social: {paciente.obra_social}</h3>
        <h3>Fecha de nacimiento: {paciente.fecha_nacimiento}</h3>
    </article>
)
}

