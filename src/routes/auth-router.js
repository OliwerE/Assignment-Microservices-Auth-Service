/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'
import { AuthController } from '../controllers/auth-controller.js'

export const router = express.Router()

const controller = new AuthController()

router.post('/login', controller.login) // Byt till post!
router.post('/register', controller.register) // Byt till post!

// All other pages
router.use('*', (req, res, next) => next(createError(404)))
