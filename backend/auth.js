import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      // Si hace falta realizar algun paso extra antes de llamar al handler de la API
      next(null, payload);
    })
  );
}


export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

router.post("/login", 
    body("email").isEmail(),
    body("password").isStrongPassword({
    minLength: 8, // Minimo de 8 caracteres
    minLowercase: 1, // Al menos una letra en minusculas
    minUppercase: 0, // Letras mayusculas opcionales
    minNumbers: 1, // Al menos un número
    minSymbols: 0, // Símbolos opcionales
  }), verificarValidaciones,
  async (req, res) => {
  
    const {email, password} = req.body;

    const [usuarios] = await db.execute("SELECT * FROM usuario WHERE email = ? ", [email]);

    if (usuarios.lenght === 0){
        return res.status(401).json({success: false, error: "Usuario invalido"});
    }

    const contraHasheada = usuarios[0].password_hash;

    const contraComparada = await bcrypt.compare(password, contraHasheada);

    if (!contraComparada){
        return res.status(400).json({success: false, error: "Contraseña invalida"});
    }

    const payload = {usedId: usuarios[0].id};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "4h"});

    res.json({
        success: true, token, nombre: usuarios[0].nombre, apellido: usuario[0].apellido
    });


});

export default router;