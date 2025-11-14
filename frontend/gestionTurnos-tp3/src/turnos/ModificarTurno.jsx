import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { Link, useNavigate, useParams } from "react-router";

export const ModificarTurno = () => {
    const {fetchAuth} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();

    const [values, setValues] = useState(null)
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);

    const fetchTurno = useCallback( async () => {
        const response = await fetchAuth(`http://localhost:3000/turnos/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success){
            console.log("Hubo un error: ", data.error);
            return;
        }

        console.log("Turno individual: ", data.data)

        setValues(data.data)

    },[fetchAuth,id]);

     const fetchMedicos = useCallback(
        async () => {
            const response = await fetchAuth("http://localhost:3000/medicos");
            const data = await response.json();

            if (!response.ok){
                console.log("Hubo un error: ", data.error);
                return;
            }

            console.log("Medicos Carga: ", data);

            setMedicos(data.data);
        },
        [fetchAuth]
    )

     const fetchPacientes = useCallback(
        async () => {
            const response = await fetchAuth("http://localhost:3000/pacientes");
            const data = await response.json();

            if (!response.ok){
                console.log("Hubo un error: ", data.error);
                return;
            }

            console.log("Pacientes carga: ", data);

            setPacientes(data.data);
        },
        [fetchAuth]
    )
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Valores guardados Turnos: ",values);

        const response = await fetchAuth(`http://localhost:3000/turnos/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if(!response.ok || !data.success){
            const mensajeError = data.message || data.error || "Error al cambiar el turno";
            console.log("Hubo un error: ", data);

            return window.alert(mensajeError);
        }

        navigate("/turnos");
    };

    useEffect(()=>{
    fetchTurno();
    fetchMedicos();
    fetchPacientes()
    },[fetchTurno, fetchMedicos, fetchPacientes]);


    if (!values) {
        return null;
    }



    return (
            <article>
                <h2>Ingrese datos del turno</h2>
                <form onSubmit={handleSubmit} >
                    <fieldset>
                    <label>
                        Paciente
                        <select 
                        required
                        value={values.paciente_id}
                        onChange={(e) => 
                            setValues({...values, paciente_id: e.target.value})
                        }
                        >
                            <option value="" disabled>Seleccione un paciente</option>
                            {pacientes.map((p) => (
                                <option key={p.id} value={p.id}>
                                {p.nombre} {p.apellido}
                                </option>
                            ))}

                        </select>
                    </label>
                    <label >
                        Medico
                        <select 
                        required
                        value={values.medico_id}
                        onChange={(e) => 
                            setValues({...values, medico_id: e.target.value})
                        }
                        >
                            <option value="" disabled>Seleccione un medico</option>
                            {medicos.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.nombre} {m.apellido} {m.especialidad}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Fecha
                        <input 
                        required
                        type="date"
                        value={values.fecha}
                        onChange={(e) => 
                            setValues({...values, fecha: e.target.value})
                        }
                        />
                    </label>
                    <label>
                        Hora
                        <input
                        required
                        type = "time"
                        value={values.hora}
                        onChange={(e) =>
                            setValues({...values,hora: e.target.value})
                        }
                        />
                    </label>
                    <label>
                        Estado
                        <select
                        required
                        value={values.estado}
                        onChange={(e) => 
                            setValues({...values,estado: e.target.value})
                        }
                        >
                            <option value="" disabled >Seleccione un estado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Atendido">Atendido</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </label>
                    <label>
                        Observaciones (Opcional)
                        <textarea 
                        value={values.observaciones}
                        onChange={(e) => 
                            setValues({...values, observaciones: e.target.value})
                        }
                        />
                    </label>
                    </fieldset>
                    <footer>
                        <input type="submit" value="Guardar turno"/>
                        <Link role="button" to="/turnos">
                            Cancelar
                        </Link>
                    </footer>
                </form>
            </article>
    )




}

