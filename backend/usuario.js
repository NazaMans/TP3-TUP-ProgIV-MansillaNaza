import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import {body, param} from "express-validator";
import bycryp from "bcrypt";
import { verificarAutenticacion } from "./auth.js";


const router = express.Router();

router.get("/",verificarAutenticacion, verificarValidaciones, async (req, res) => {

    const [rows] = await db.execute("SELECT * FROM usuario");

    res.json({succes: true, usuarios: rows.map((u) => ({...u, password_hash: undefined})),
});

});

router.get(":id",verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {

    const id = Number(req.params.id);
    const [rows] =  await db.execute("SELECT id, nombre, email WHERE id = ?", [id]);

    if (rows.lenght === 0){
        return res.status(404).json({success: false, message: "Usuario no encontrado"})

    }


    res.json({succes: true, usuario: rows[0]})
});

router.post("/",
    verificarAutenticacion, 
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

    res.status(201).json({succes: true, data: {id: result.insertId, nombre, apellido, nombre},});
  
});

router.put("/:id", (req, res) => {


})

router.delete("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req,res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM usuario WHERE id = ?", [id]);

    res.json({success: true, message: "Usuario eliminado"})
})

export default router;
