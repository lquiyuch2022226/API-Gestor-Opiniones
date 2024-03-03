import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlwares/validar-campos.js';
import { validarJWT } from '../middlwares/validar-jwt.js';

import { 
    commentPost
} from './comment.controller.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check("commentText", "The comment is required").not().isEmpty(),
        validarCampos
    ], commentPost);

export default router;
