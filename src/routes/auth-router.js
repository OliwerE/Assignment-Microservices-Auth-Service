/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'
// import { #Controller } from '../controllers/#'

export const router = express.Router()

// const controller = new #Controller()

router.get('/login', (req, res, next) => {res.json({ message: "login!" })})
router.get('/register', (req, res, next) => {res.json({ message: "register!" })})

// All other pages
router.use('*', (req, res, next) => next(createError(404)))