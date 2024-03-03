import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlwares/validar-campos.js';
import { validarJWT } from '../middlwares/validar-jwt.js';

import {
    commentPost,
    commentsGet,
    commentPut,
    commentDelete
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
    '/', commentsGet
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'This is not a valid id').isMongoId(),
        validarCampos
    ], commentPut);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'This is not a valid id').isMongoId(),
        validarCampos
    ], commentDelete);

export default router;
