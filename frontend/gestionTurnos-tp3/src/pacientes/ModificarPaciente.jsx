import {useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/auth";
import { Link, useNavigate, useParams } from "react-router";

export const ModificarPaciente = () => {
    const {fetchAuth} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();

    const [values, setValues] = useState(null)

    const fetchPaciente = useCallback( async () => {
        const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success){
            console.log("Hubo un error: ", data.error);
            return;
        }

        console.log("Paciente individual: ", data.data)

        setValues(data.data)

    },[fetchAuth,id]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Valores guardados Turnos: ",values);

        const response = await fetchAuth(`http://localhost:3000/pacientes/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if(!response.ok || !data.success){
            const mensajeError = data.message || data.error || "Error al cambiar el paciente";
            console.log("Hubo un error: ", data);

            return window.alert(mensajeError);
        }

        navigate("/pacientes");
    };

    useEffect(()=>{
        fetchPaciente();
    },[fetchPaciente])


    if (!values) {
        return null;
    }



    return (
        <article>
            <h2>Ingrese los datos del paciente</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        Nombre
                        <input required
                        value={values.nombre}
                        onChange={(e) => 
                            setValues({...values, nombre: e.target.value})
                        } 
                        />
                    </label>
                    <label>
                        Apellido
                        <input required
                        value={values.apellido}
                        onChange={(e) => 
                            setValues({...values, apellido: e.target.value})
                        } 
                        />
                    </label>
                    <label>
                        DNI
                        <input 
                        required
                        type="number"
                        value={values.dni}
                        onChange={(e) => 
                            setValues({...values, dni: e.target.value})
                        } 
                        />
                    </label>
                    <label>
                        Fecha de nacimiento
                        <input 
                        required
                        type="date"
                        value={values.fecha_nacimiento}
                        onChange={(e) => 
                            setValues({...values, fecha_nacimiento: e.target.value})
                        }
                        />
                    </label>
                    <label>
                        Obra social
                        <input required
                        value={values.obra_social}
                        onChange={(e) => 
                            setValues({...values, obra_social: e.target.value})
                        } 
                        />
                    </label>
                </fieldset>
                <footer>
                    <input type="submit" value="Guardar paciente"/>
                    <Link role="button" to="/pacientes">
                    Cancelar
                    </Link>
                </footer>
            </form>
        </article>
    )




}

