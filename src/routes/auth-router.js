/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'
import { AuthController } from '../controllers/auth-controller.js'

export const router = express.Router()

const controller = new AuthController()

router.get('/login', controller.login) // Byt till post!
router.get('/register', controller.register) // Byt till post!

// All other pages
router.use('*', (req, res, next) => next(createError(404)))