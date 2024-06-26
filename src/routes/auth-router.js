/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'
import { AuthController } from '../controllers/auth-controller.js'

export const router = express.Router()

const controller = new AuthController()

router.get('/', (req, res, next) => { res.json({ message: 'Welcome to auth service!' }) })

router.post('/login', controller.login)
router.post('/register', controller.register)

// All other pages
router.use('*', (req, res, next) => next(createError(404)))
