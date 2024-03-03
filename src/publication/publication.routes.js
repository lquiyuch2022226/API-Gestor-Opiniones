import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlwares/validar-campos.js';
import { validarJWT } from '../middlwares/validar-jwt.js';

import { 
    publicationPost,
    publicationsGet,
    publicationPut,/*
publicationsDelete */} from './publication.controller.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check("title", "The title is required").not().isEmpty(),
        check("category", "The category is required").not().isEmpty(),
        check("text", "The principal text is required").not().isEmpty(),
        validarCampos
    ], publicationPost);

router.get('/', validarJWT, publicationsGet);

router.put(
    "/:id",
    [
        validarJWT,
        validarCampos
    ],
    publicationPut
);

export default router;