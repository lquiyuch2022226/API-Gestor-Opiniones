import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlwares/validar-campos.js';
import { validarJWT } from '../middlwares/validar-jwt.js';
import { existePublicationById } from '../helpers/db-validators.js';

import {
    commentPost,
    commentsGet
} from './comment.controller.js';

const router = Router();

router.post(
    '/:publi',
    [
        validarJWT,
        check('publi', 'This is not a valid id').isMongoId(),
        check("commentText", "The comment is required").not().isEmpty(),
        validarCampos
    ], commentPost);

router.get(
    '/',
    validarJWT,
    commentsGet
);

export default router;
