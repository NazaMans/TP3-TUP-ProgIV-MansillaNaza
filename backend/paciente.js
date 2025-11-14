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

router.get("/:id",verificarAutenticacion, validarId, verificarValidaciones, async (req, res) =>{
   
    const id = Number(req.params.id);

    const [validacion] = await db.execute("SELECT * FROM paciente WHERE id = ?", [id]);

    if (validacion.length === 0){
        return res.status(404).json({success: false, message: "Paciente no encotnrado"});
    }

    const [result] = await db.execute("SELECT id, nombre, apellido, dni, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento, obra_social FROM paciente WHERE id = ?", [id]);

    res.json({success: true, data: result[0]});

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

router.put("/:id",verificarAutenticacion, validarId,
    body("nombre", "Nombre no valido").isLength({max:20}),
    body("apellido", "Apellido no valido").isLength({max:20}),
    body("dni", "DNI no valido").isLength({min:7, max:8}),
    body("fecha_nacimiento", "Fecha de nacimiento no valida").isDate(),
    body("obra_social", "Obra social no valida").isLength({max:20}),
    verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);

    const [validar] = await db.execute("SELECT * FROM paciente WHERE id = ?", [id]);

    if (validar.length === 0){
        return res.status(404).json({success: false, message: "Paciente no encontrado"});
    }

    const {nombre, apellido, dni, fecha_nacimiento, obra_social} = req.body;

    const [validarExisteni] = await db.execute("SELECT * FROM paciente WHERE dni = ? AND id != ?", [dni, id]);

    if (validarExisteni.length > 0){
        return res.status(400).json({success: false, message: "DNI ya registrado"});

    }

    const [result] = await db.execute("UPDATE paciente SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, obra_social = ? WHERE id = ?", [nombre, apellido, dni, fecha_nacimiento, obra_social, id]);

    res.json({success: true, data: {id, nombre, apellido, dni, fecha_nacimiento, obra_social}});

});

router.delete("/:id",verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);

    const [validar] = await db.execute("SELECT * FROM paciente WHERE id = ?", [id]);

    if (validar.length === 0){
        return res.status(404).json({success: false, message: "Paciente no encontrado"});
    }


    await db.execute("DELETE FROM paciente WHERE id = ?", [id]);

    res.json({success: true, message: "Paciente eliminado"});

});

export default router;