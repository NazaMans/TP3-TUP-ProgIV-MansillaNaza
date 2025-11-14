import { useState } from "react";
import { useAuth } from "../auth/auth";
import { Link, useNavigate } from "react-router";

export function CargarMedico() {

    const {fetchAuth} = useAuth();

    // eslint-disable-next-line no-unused-vars
    const [errores, setErrores] = useState(null);

    const navigate = useNavigate();

    const initialValues = {

    nombre: "",
    apellido: "",
    especialidad: "",
    matricula_profesional: "",  
    }

    const [values, setValues] = useState(initialValues);

    const handleSubmit = async (e) =>{
        e.preventDefault();

        setErrores(null)

        const response = await fetchAuth("http://localhost:3000/medicos",{

            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values),

        });

        const data = await response.json();

        if (!response.ok || !data.success){
            if(response.status === 400){
                return setErrores(data.errores);
            }

            return window.alert("Error al crear al medico")
        }

        setValues(initialValues);

        navigate("/medicos");
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
                        Especialidad
                        <input 
                        required
                        value={values.especialidad}
                        onChange={(e) => 
                            setValues({...values, especialidad: e.target.value})
                        } 
                        />
                    </label>
                    <label>
                        MAtricula profesional
                        <input required
                        value={values.matricula_profesional}
                        onChange={(e) => 
                            setValues({...values, matricula_profesional: e.target.value})
                        } 
                        />
                    </label>
                </fieldset>
                <footer>
                    <input type="submit" value="Guardar medico"/>
                    <Link role="button" to="/medicos">
                    Cancelar
                    </Link>
                </footer>
            </form>
        </article>
    )

}