import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import {body, param} from "express-validator";
import bycryp from "bcrypt";
import { verificarAutenticacion } from "./auth.js";


const router = express.Router();

router.get("/",verificarAutenticacion, verificarValidaciones, async (req, res) => {

    const [rows] = await db.execute("SELECT * FROM usuario");

    res.json({success: true, usuarios: rows.map((u) => ({...u, password_hash: undefined})),
});

});

router.get("/:id",verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);
    const [rows] =  await db.execute("SELECT id, nombre, apellido, email FROM usuario WHERE id = ?", [id]);

    if (rows.lenght === 0){
        return res.status(404).json({success: false, message: "Usuario no encontrado"})

    }

    res.json({success: true, usuario: rows[0]})
});

router.post("/", 
    body("nombre", "Nombre no valido")
    .isAlpha("es-ES").isLength({max:20}),
    body("apellido", "Apellido no valido")
    .isAlpha("es-ES").isLength({max:20}),
    body("email", "Email no valido")
    .isEmail(),
    body("password", "Contraseña inválida").isStrongPassword({
    minLength: 8, // Minimo de 8 caracteres
    minLowercase: 1, // Al menos una letra en minusculas
    minUppercase: 0, // Letras mayusculas opcionales
    minNumbers: 1, // Al menos un número
    minSymbols: 0, // Símbolos opcionales
  }),
  verificarValidaciones,
  async (req, res) => {

    const {nombre, apellido, email, password} = req.body;

    const contraHasheada = await bycryp.hash(password, 12);

    const  [result] = await db.execute("INSERT INTO usuario (nombre, apellido, email, password_hash) VALUES (?, ?, ?, ?)", [nombre, apellido, email, contraHasheada])

    res.status(201).json({success: true, data: {id: result.insertId, nombre, apellido, nombre},});
  
});

router.put("/:id",verificarAutenticacion, validarId,
    body("nombre", "Nombre no valido")
    .isAlpha("es-ES").isLength({max:20}),
    body("apellido", "Apellido no valido")
    .isAlpha("es-ES").isLength({max:20}),
    body("email", "Email no valido")
    .isEmail(),
    verificarValidaciones, async (req, res) => {

        const id = Numbers(req.params.id);

        const [validar] = await db.execute("SELECT * FROM usuario WHERE id = ?", [id]);

        if (validar.length === 0){
            return res.status(404).json({success:false, message: "Usuario no encontrado"});
        }
        
        const {nombre, apellido, email} = req.body;

        const [validarExistencia] = await db.execute("SELECT * FROM usuario WHERE email = ? AND id != ?",[email,id]);

        if (validarExistencia.length > 0){
            return res.status(400).json({success: false, message: "Email ya registrado"});
        }

        const [result] = await db.execute("UPDATE usuario SET nombre = ?, apellido = ?, email = ? WHERE id = ?", [nombre, apellido, email, id]);

        res.json({success: true, data: {id, nombre, apellido, email}});


})

router.delete("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req,res) => {

    const id = Number(req.params.id);

    const [validar] = await db.execute("SELECT * FROM usuario WHERE id = ?", [id]);

    if (validar.length === 0){
        return res.status(404).json({success: false, message: "Usuario no encontrado"});
    }

    await db.execute("DELETE FROM usuario WHERE id = ?", [id]);

    res.json({success: true, message: "Usuario eliminado"})
})

export default router;
