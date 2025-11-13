import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";

import usuarioRouter from "./usuario.js"
import routerMedicos from "./medico.js"
import routerPacientes from "./paciente.js"

conectarDB();

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());


app.get("/", (req, res) => {
    res.send("TP3 de programacion IV")
});

app.use("/usuarios", usuarioRouter);
app.use("/medicos", routerMedicos);
app.use("/pacientes", routerPacientes);

app.listen(port, () => {
    console.log("La aplicacion esta andando en el puerto 3000, lo quiero profe :)")
})