import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth/auth";
import { Link } from "react-router";

export function TablaTurnos() {
  const { fetchAuth } = useAuth(); 

  const [turnos, setTurnos] = useState([]);
  
 
  const [medicos, setMedicos] = useState([]); 
  const [pacientes, setPacientes] = useState([]);

  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");

  const fetchTurnos = useCallback(
    async (paId, meId) => {
      const searchParams = new URLSearchParams();

      if (paId) {
        searchParams.append("paciente_id", paId);
      }

      if (meId) {
        searchParams.append("medico_id", meId);
      }

      const response = await fetchAuth(
        "http://localhost:3000/turnos" +
          (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("hubo un error: ", data.error);
        return;
      }

      console.log("Turnos: ", data);
      
      setTurnos(data.data || []); 
    },
    [fetchAuth]
  );

  useEffect(() => {
    
    fetchTurnos(); 

   
    const fetchDropdownData = async () => {
      try {
        const resPacientes = await fetchAuth(
          "http://localhost:3000/pacientes"
        );
        const dataPacientes = await resPacientes.json();
        
        if (resPacientes.ok) setPacientes(dataPacientes.data); 

        const resMedicos = await fetchAuth("http://localhost:3000/medicos");
        const dataMedicos = await resMedicos.json();
        
        if (resMedicos.ok) setMedicos(dataMedicos.data);
      } catch (error) {
        console.error("Hubo un error cargando filtros: ", error);
      }
    };

    fetchDropdownData();

  }, [fetchTurnos, fetchAuth]); 

  
  const handleLimpiarFiltros = () => { 
    setPacienteId("");
    setMedicoId("");
    fetchTurnos("", "");
  };

  return (
    <article>
      <h2>Tabla de turnos</h2>
      <Link role="button" to="/turnos/crear">
        Crear nuevo turno
      </Link>

      <div
        className="group"
        style={{ display: "flex", gap: "15px", margin: "1rem 0" }}
      >
        <div>
          <label
            htmlFor="paciente"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Paciente
          </label>
          <select
            id="paciente"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
          >
            <option value="">Todos los pacientes</option>
           
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellido || ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="medico"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Médico
          </label>
          <select
            id="medico"
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
          >
            <option value="">Todos los médicos</option>
            
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} {m.apellido || ""}
              </option>
            ))}
          </select>
        </div>
        <div style={{ alignSelf: "flex-end" }}>
          <button onClick={() => fetchTurnos(pacienteId, medicoId)}>
            Buscar
          </button>
        </div>
        <div style={{ alignSelf: "flex-end" }}>
          <button className="secondary" onClick={handleLimpiarFiltros}>
            Limpiar
          </button>
        </div>
      </div>
      <div className="group">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Medico</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nombre_paciente}</td>
                <td>{t.nombre_medico}</td>
                <td>{t.fecha}</td>
                <td>{t.hora}</td>
                <td>{t.estado}</td>
                <td>
                  <div>
                    <Link role="button" to={`/turnos/${t.id}`}>
                      Ver
                    </Link>
                    <Link
                      role="button"
                      to={`/turnos/${t.id}/modificar`}
                    >
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
  );
}