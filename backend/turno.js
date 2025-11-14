import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import {body, param, query} from "express-validator";
import { verificarAutenticacion } from "./auth.js";

//turno: id, paciente_id, medico_id, fecha, hora, estado, observaciones

const router = express.Router();

router.get("/",verificarAutenticacion,
    query("paciente_id", "Id de paciente no valido").optional().isInt({min:1}),
    query("medico_id", "Id de medico no valido").optional().isInt({min:1}),
    verificarValidaciones, async (req, res) => {

    const {paciente_id, medico_id} = req.query;

    let sql = "SELECT t.id, p.nombre AS nombre_paciente, m.nombre AS nombre_medico, DATE_FORMAT(t.fecha, '%Y-%m-%d') AS fecha, t.hora, t.estado, t.observaciones FROM turno t INNER JOIN paciente p ON t.paciente_id = p.id INNER JOIN medico m ON t.medico_id = m.id";

    const params = [];
    const condiciones = [];

    if (paciente_id){
        condiciones.push("t.paciente_id = ?");
        params.push(paciente_id);
    }

    if (medico_id){
        condiciones.push("t.medico_id = ?");
        params.push(medico_id);
    }

    if (condiciones.length > 0){
        sql += " WHERE " + condiciones.join(" AND ");
    }

    const [rows] = await db.execute(sql, params);

    res.json({success: true, data: rows});

});

router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
    
    const id = Number(req.params.id);

    const [rows] = await db.execute("SELECT id, paciente_id, medico_id, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, TIME_FORMAT(hora, '%H:%i') AS hora, estado, observaciones FROM turno WHERE id = ?",[id]);

    if (rows.length === 0){
        return res.status(404).json({success: false, message: "Turno no encontrado"});
    }

    res.status(200).json({success: true, data: rows[0]});

})

router.get("/:id/info", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
    
    const id = Number(req.params.id);

     let sql = "SELECT t.id, p.nombre AS nombre, p.apellido AS apellido, p.dni AS dni , m.nombre AS nombre_medico, m.apellido AS apellido_medico,m.especialidad AS especialidad,m.matricula_profesional AS matricula, DATE_FORMAT(t.fecha, '%Y-%m-%d') AS fecha, t.hora, t.estado, t.observaciones FROM turno t INNER JOIN paciente p ON t.paciente_id = p.id INNER JOIN medico m ON t.medico_id = m.id WHERE t.id = ?";

     const [rows] = await db.execute(sql, [id]);

    if (rows.length === 0){
        return res.status(404).json({success: false, message: "Turno no encontrado"});
    }

    res.status(200).json({success: true, data: rows[0]});

})



router.post("/",verificarAutenticacion, 
    body("paciente_id", "Paciente no valido").isInt({min:1}),
    body("medico_id", "Medico no valido").isInt({min:1}),
    body("fecha", "Fecha no valida").isDate(),
    body("hora", "Hora no valida").isTime(),
    body("estado", "Estado no valido").isString().isIn(["Pendiente", "Atendido", "Cancelado"]),
    body("observaciones", "Observaciones no validas").isString().isLength({max:200}),
    verificarValidaciones,
    async (req, res) => {

        const {paciente_id, medico_id, fecha, hora, estado, observaciones} = req.body;

        const [result]  = await db.execute("INSERT INTO turno (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?)", [paciente_id, medico_id, fecha, hora, estado, observaciones]);

        res.status(201).json({success: true, data: {id: result.insertId, paciente_id, medico_id, fecha, hora, estado, observaciones}})

    });

router.put("/:id",verificarAutenticacion, validarId,
    body("paciente_id", "Paciente no valido").isInt({min:1}),
    body("medico_id", "Medico no valido").isInt({min:1}),
    body("fecha", "Fecha no valida").isDate(),
    body("hora", "Hora no valida").isTime(),
    body("estado", "Estado no valido").isString().isIn(["Pendiente", "Atendido", "Cancelado"]),
    body("observaciones", "Observaciones no validas").isString().isLength({max:200}),
    verificarValidaciones, 
    async (req, res) => {

    const id = Number(req.params.id);

    const [verificar] = await db.execute("SELECT * FROM turno WHERE id = ?", [id]);
    
    if (verificar.length === 0){
        return res.status(404).json({success: false, message: "Turno no encontrado"});
    }

    const {paciente_id, medico_id, fecha, hora, estado, observaciones} = req.body;


    const [validarDiferente] = await db.execute("SELECT * FROM turno WHERE fecha = ? AND hora = ? AND id != ?", [fecha, hora, id]);

    if (validarDiferente.length > 0){
        return res.status(400).json({success: false, message: "Fecha y hora ya ocupadas"});
    }

    const [result] = await db.execute("UPDATE turno SET paciente_id = ?, medico_id = ?, fecha = ?, hora = ?, estado = ?, observaciones = ? WHERE id = ?", [paciente_id, medico_id, fecha, hora, estado, observaciones, id]);

    res.json({success: true, data: {id, paciente_id, medico_id, fecha, hora, estado, observaciones}});

});

router.delete("/:id",verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);

    const [verificar] = await db.execute("SELECT * FROM turno WHERE id = ?", [id]);

    if (verificar.length === 0){
        return res.status(404).json({success: false, message: "Turno no encontrado"});
    }

    await db.execute("DELETE FROM turno WHERE id = ?", [id]);

    res.json({success: true, message: "Turno eliminado"});

});

export default router;