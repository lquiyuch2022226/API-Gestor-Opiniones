import { Router } from "express";
import { check } from "express-validator";

import { login } from "./auth.controller.js";
import { validarCampos } from "../middlwares/validar-campos.js";

const router = Router()

router.post(
    '/login',
    [
        check('correo', "This isn't a valid email").isEmail(),
        check('password', "The password is required").not().isEmpty(),
        validarCampos,
    ], login);

export default router