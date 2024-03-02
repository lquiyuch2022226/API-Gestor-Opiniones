import { Router } from 'express';
import { check } from 'express-validator';

import { existenteEmail, existeUsuarioById } from "../helpers/db-validators.js";
import { validarCampos } from '../middlwares/validar-campos.js';
// import { validarJWT } from "../middlewares/validar-jwt.js";

import {
    usuariosPost,
    usuariosGet,
    getUsuarioById,
    usuariosPut
} from './user.controller.js';

const router = Router();

router.post(
    "/",
    [
        check("nombre", "The name cannot be empty").not().isEmpty(),
        check("password", "The name cannot be empty").not().isEmpty(),
        check("password", "The password must have minimum 6 characters").isLength({ min: 6 }),
        check("correo", "The email cannot be empty").not().isEmpty(),
        check("correo", "This isn't a email").isEmail(),
        check("correo").custom(existenteEmail),
        validarCampos,
    ],
    usuariosPost
)

router.get("/", usuariosGet);

router.get(
    "/:id",
    [
        check("id", "This isn't a valid ID").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    getUsuarioById
);

router.put(
    "/:id",
    [
        check("id", "This isn't a valid ID").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    usuariosPut
);

export default router;