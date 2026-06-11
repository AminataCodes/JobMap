import express from 'express'

import {
    createOffre,
    getOffres
} from '../controllers/offre.controller.js'

import {
    verifyToken
} from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/', verifyToken, createOffre)

router.get('/', getOffres)

export default router