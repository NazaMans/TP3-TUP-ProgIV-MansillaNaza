import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import {body, param} from "express-validator";
import { verificarAutenticacion } from "./auth.js";


const router = express.Router();

//medico: id, nombre, apellido, especialidad, matricula_profesional

router.get("/", verificarAutenticacion, verificarValidaciones, async (req, res) => {
    
    const [rows] = await db.execute("SELECT * FROM medico");

    res.json({success: true, data: rows});
});

router.get("/:id",verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);

    const [rows] = await db.execute("SELECT * FROM medico WHERE id = ?", [id]);

    if (rows.length === 0){
        return res.status(404).json({success: false, message: "Medico no encontrado"});
    }

    res.json({success: true, medico: rows[0]});

});

router.post("/",
    verificarAutenticacion, 
    body("nombre", "Nombre no valido").isLength({max:20}).isAlpha("es-ES"),
    body("apellido", "Apellido no valido").isLength({max:20}).isAlpha("es-ES"),
    body("especialidad", "Especialidad no valida").isLength({max:20}).isAlpha("es-ES"),
    body("matricula_profesional", "Matricula no valida").isInt({min:10}).isLength({max:30}),
    verificarValidaciones, 
    async (req, res) => {

        const {nombre, apellido, especialidad, matricula_profesional} = req.body;

        const [result] = await db.execute("INSERT INTO medico (nombre, apellido, especialidad, matricula_profesional) VALUES (?, ?, ?, ?)", 
            [nombre, apellido, especialidad, matricula_profesional]);

            res.status(201).json({success: true, data: {id: result.insertId, nombre, apellido, especialidad, matricula_profesional}});

    })

router.put("/:id",verificarAutenticacion, validarId,
    body("nombre", "Nombre no valido").isLength({max:20}).isAlpha("es-ES"),
    body("apellido", "Apellido no valido").isLength({max:20}).isAlpha("es-ES"),
    body("especialidad", "Especialidad no valida").isLength({max:20}).isAlpha("es-ES"),
    body("matricula_profesional", "Matricula no valida").isInt({min:10}).isLength({max:30}),
    verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);

    const [verificar] = await db.execute("SELECT * FROM medico WHERE id = ?", [id]);

    if (verificar.length === 0){
        return res.status(404).json({success: false, message: "Medico no encontrado"});
    }

    const {nombre, apellido, especialidad, matricula_profesional} = req.body;

    const [validarDiferente] = await db.execute("SELECT * FROM medico WHERE matricula_profesional = ? AND id != ?", [matricula_profesional, id]);

    if (validarDiferente.length > 0){
        return res.status(400).json({success: false, message: "Matricula ya registrada"});
    }

    const [result] = await db.execute("UPDATE medico SET nombre = ?, apellido = ?, especialidad = ?, matricula_profesional = ? WHERE id = ?", [nombre, apellido, especialidad, matricula_profesional, id]);

    res.json({success: true, data: {id, nombre, apellido, especialidad, matricula_profesional}});


});

router.delete("/:id",verificarAutenticacion, validarId, async (req, res) => {

    const id = Number(req.params.id);

    const [verificar] = await db.execute("SELECT * FROM medico WHERE id = ?", [id]);

    if (verificar.length === 0){
        return res.status(404).json({success: false, message: "Medico no encontrado"});
    }

    await db.execute("DELETE FROM medico WHERE id = ?", [id]);

    res.json({success: true, message: "Medico eliminado"});

});

export default router;