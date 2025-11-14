import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { useParams } from "react-router";

export const DetallesUsuario = () => {

  const {fetchAuth} = useAuth();
  const {id} = useParams();
  const [usuario, setUsuario] = useState(null);

  const fetchUsuario = useCallback( async () => {
    const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`);
    const data = await response.json();

    if (!response.ok || !data.success){
      console.log("Hubo un error: ", data.error);
      return;
    }

    setUsuario(data.usuario);
  },[fetchAuth,id]);

  useEffect(() => {
    fetchUsuario();
  },[fetchUsuario]);

  if (!usuario){
    return null;
  }

  return(
    <article>
      <h2>Detalles del usuario</h2>
      <h3>Nombre: {usuario.nombre}</h3>
      <h3>Apellido: {usuario.apellido}</h3>
      <h3>Email: {usuario.email}</h3>
    </article>
  )


}