/**
 * Module represents the main router.
 */

import express from 'express'
import createError from 'http-errors'
import { router as authRouter } from './auth-router.js'

export const router = express.Router()

router.get('/', (req, res, next) => { res.json({ message: 'Welcome to auth service!' }) })

router.use('/auth', authRouter)

// All other pages
router.use('*', (req, res, next) => next(createError(404)))
