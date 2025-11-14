import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { useParams } from "react-router";

export const DetallesTurno = () => {

    const {fetchAuth} = useAuth();
    const {id} = useParams();
    const [turno,setTurno] = useState(null);

    const fetchTurno = useCallback( async () => {
        
        const response = await fetchAuth(`http://localhost:3000/turnos/${id}/info`);
        const data  = await response.json();

        if (!response.ok || !data.success){
            console.log("Hubo un error: ", data.error);
            return;
        }

        setTurno(data.data);

    },[fetchAuth,id]);

    useEffect(() => {
        fetchTurno();
    },[fetchTurno]);

    if (!turno){
        return null;
    }

    return (
        <article>
            <h2>Detalles del turno</h2>
            <br />
            <h3>Paciente: {turno.nombre} {turno.apellido}</h3>
            <h3>DNI: {turno.dni}</h3>
            <h3>Medico: {turno.nombre_medico} {turno.apellido_medico}</h3>
            <h3>Especialidad: {turno.especialidad}</h3>
            <h3>Matricula: {turno.matricula}</h3>
            <h3>Fecha: {turno.fecha}</h3>
            <h3>Hora: {turno.hora}</h3>
            <h3>Estado: {turno.estado}</h3>
            <h3>Observaciones: {turno.observaciones}</h3>
        </article>
    )

}