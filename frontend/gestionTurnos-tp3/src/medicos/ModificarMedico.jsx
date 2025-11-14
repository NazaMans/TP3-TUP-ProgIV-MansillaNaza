import {useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/auth";
import { Link, useNavigate, useParams } from "react-router";

export const ModificarMedico = () => {
    const {fetchAuth} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    const [errores, setErrores] = useState(null);

    const [values, setValues] = useState(null)

    const fetchMedico = useCallback( async () => {
        const response = await fetchAuth(`http://localhost:3000/medicos/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success){
            if(response.status === 400){
                return setErrores(data.errores);
            }
        }

        console.log("MEdico individual: ", data.medico)

        setValues(data.medico)

    },[fetchAuth,id]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Valores guardados Turnos: ",values);

        const response = await fetchAuth(`http://localhost:3000/medicos/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if(!response.ok || !data.success){
            if (response.status === 400) {
                return setErrores(data.errores);
            }
            const mensajeError = data.message || data.error || "Error al cambiar el medico";
            console.log("Hubo un error: ", data);

            return window.alert(mensajeError);
  
        }

        navigate("/medicos");
    };

    useEffect(()=>{
        fetchMedico();
    },[fetchMedico])


    if (!values) {
        return null;
    }

    return (
            <article>
                <h2>Ingrese daros del medico</h2>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <label>
                            Nombre
                            <input required
                            value={values.nombre}
                            onChange={(e) => 
                                setValues({...values, nombre: e.target.value})
                            } 
                            aria-invalid={errores && errores.some((e) => e.path === "nombre")}
                            />
                            {errores && (
                             <small>{errores.filter((e) => e.path === "nombre").map((e) => e.msg).join(", ")}</small>
                        )}
                        </label>
                        <label>
                            Apellido
                            <input required
                            value={values.apellido}
                            onChange={(e) => 
                                setValues({...values, apellido: e.target.value})
                            } 
                            aria-invalid={errores && errores.some((e) => e.path === "apellido")}
                            />
                            {errores && (
                             <small>{errores.filter((e) => e.path === "apellido").map((e) => e.msg).join(", ")}</small>
                        )}
                        </label>
                        <label>
                            Especialidad
                            <input 
                            required
                            value={values.especialidad}
                            onChange={(e) => 
                                setValues({...values, especialidad: e.target.value})
                            } 
                            aria-invalid={errores && errores.some((e) => e.path === "especialidad")}
                            />
                            {errores && (
                             <small>{errores.filter((e) => e.path === "especialidad").map((e) => e.msg).join(", ")}</small>
                        )}
                        </label>
                        <label>
                            MAtricula profesional
                            <input required
                            value={values.matricula_profesional}
                            onChange={(e) => 
                                setValues({...values, matricula_profesional: e.target.value})
                            } 
                            aria-invalid={errores && errores.some((e) => e.path === "matricula_profesional")}
                            />
                            
                        </label>
                    </fieldset>
                    <footer>
                        <input type="submit" value="Editar medico"/>
                        <Link role="button" to="/medicos">
                        Cancelar
                        </Link>
                    </footer>
                </form>
            </article>
        )

}

