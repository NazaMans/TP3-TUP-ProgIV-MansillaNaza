import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import {body, param} from "express-validator";
import { verificarAutenticacion } from "./auth.js";

//paciente: id, nombre, apellido, dni, fecha_nacimiento, obra_social

const router = express.Router();

router.get("/",verificarAutenticacion, verificarValidaciones, async (req, res) => {

    const [rows] = await db.execute("SELECT * FROM paciente");

    res.json({success: true, data: rows});

});

router.post("/",
    verificarAutenticacion,
    body("nombre", "Nombre no valido").isLength({max:20}),
    body("apellido", "Apellido no valido").isLength({max:20}),
    body("dni", "DNI no valido").isLength({min:7, max:8}),
    body("fecha_nacimiento", "Fecha de nacimiento no valida").isDate(),
    body("obra_social", "Obra social no valida").isLength({max:20}),
    verificarValidaciones, async (req, res) => {


        const {nombre, apellido, dni, fecha_nacimiento, obra_social} = req.body;

        const [result] = await db.execute("INSERT INTO paciente (nombre, apellido, dni, fecha_nacimiento, obra_social) VALUES (?, ?, ?, ?, ?)", [nombre, apellido, dni, fecha_nacimiento, obra_social]);

        res.status(201).json({success: true, data: {id: result.insertId, nombre, apellido, dni, fecha_nacimiento, obra_social }});

        });

router.put("/", (req, res) => {

    const validarExistencia = "SELECT * FROM "

});

router.delete("/:id",verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {

    

    const id = Number(req.params.id);

    await db.execute("DELETE FROM paciente WHERE id = ?", [id]);

    res.json({success: true, message: "Paciente eliminado"});


});

export default router;