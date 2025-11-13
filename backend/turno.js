import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import {body, param} from "express-validator";

//turno: id, paciente_id, medico_id, fecha, hora, estado, observaciones

const router = express.Router();

router.get("/", async (req, res) => {

    const sql = "SELECT t.id, p.nombre AS nombre_paciente, m.nombre AS nombre_medico, t.fecha, t.hora, t.estado, t.observaciones FROM turno t INNER JOIN paciente p ON t.paciente_id = p.id INNER JOIN medico m ON t.medico_id = m.id"

    const [rows] = await db.execute(sql);

    res.json({success: true, data: rows});

});

router.post("/", 
    body("paciente_id", "Paciente no valido").isInt({min:1}),
    body("medico_id", "Medico no valido").isInt({min:1}),
    body("fecha", "Fecha no valida").isDate(),
    body("hora", "Hora no valida").isTime(),
    body("estado", "Estado no valido").isString().isIn(["pendiente", "atendido", "cancelado"]),
    body("observaciones", "Observaciones no validas").isString().isLength({max:200}),
    verificarValidaciones,
    async (req, res) => {

        const {paciente_id, medico_id, fecha, hora, estado, observaciones} = req.body;

        const [result]  = await db.execute("INSERT INTO turno (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?)", [paciente_id, medico_id, fecha, hora, estado, observaciones]);

        res.status(201).json({success: true, data: {id: result.insertId, paciente_id, medico_id, fecha, hora, estado, observaciones}})

    });

router.put("/:id", (req, res) => {

});

router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);

    await db.execute("DELETE FROM turno WHERE id = ?", [id]);

    res.json({success: true, message: "Turno eliminado"});

});

export default router;