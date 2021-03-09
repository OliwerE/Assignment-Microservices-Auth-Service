/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'
// import { #Controller } from '../controllers/#'

export const router = express.Router()

// const controller = new #Controller()

router.get('/', (req, res, next) => {res.json({ message: "Welcome to auth service!" })})



// All other pages
router.use('*', (req, res, next) => next(createError(404)))
