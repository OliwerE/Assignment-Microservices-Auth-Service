/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'
// import { SessionController } from '../controllers/session-controller.js'

export const router = express.Router()

// const controller = new SessionController()

router.use('/', (req, res, next) => {res.json({ message: "Welcome to auth service!" })})



// All other pages
router.use('*', (req, res, next) => next(createError(404)))
