/**
 * Module represents auth controller.
 */

import createError from 'http-errors'
import { Account } from '../models/account-model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { readFileSync } from 'fs'
import IsEmail from 'isemail'

/**
 * Class represents the authorization controller.
 */
export class AuthController {
  /**
   * Used when an user sends a login request.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {object} - The response object.
   */
  async login (req, res, next) {
    try {
      const email = req.body.email
      const password = req.body.password

      console.log(email, ' ', password)

      const user = (await Account.find({ email: email })).map(Account => ({
        id: Account._id,
        email: Account.email,
        password: Account.password
      }))

      if (email === undefined || password === undefined || !IsEmail.validate(email) || user.length <= 0) {
        return res.status(401).json({ description: 'Invalid credentials' })
      }

      const comparePassword = await bcrypt.compare(password, user[0].password)
      console.log(comparePassword)

      if (comparePassword === true) {
        const payload = {
          sub: user[0].email,
          x_permission_level: 1
        }
        const privateKey = readFileSync('private.pem', 'utf-8')
        const accessToken = jwt.sign(payload, privateKey, {
          algorithm: 'RS256',
          expiresIn: process.env.ACCESS_TOKEN_LIFE
        })

        return res.status(200).json({ access_token: accessToken })
      } else {
        return res.status(401).json({ description: 'Invalid credentials!' })
      }
    } catch (err) {
      next(createError(500))
    }
  }

  /**
   * Used when an user sends a register account request.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {object} - Sends a response object to the client.
   */
  async register (req, res, next) {
    try {
      const email = req.body.email
      const password = req.body.password

      if (email === undefined || password === undefined) {
        return res.status(400).json({ description: 'Enter both email and password!' })
      } else if (password.length > 1000) {
        return res.status(400).json({ description: 'Password is too long (max 1000).' })
      } else if (password.length < 10) {
        return res.status(400).json({ description: 'Password is too short (min 10).' })
      } else if (!IsEmail.validate(email)) { // If email is an email adress
        return res.status(400).json({ description: 'Email is not an email' })
      }

      if (email && password !== undefined) {
        const uniqueEmail = await Account.find({ email: email })
        if (uniqueEmail.length === 0) {
          const newAccount = new Account({
            email: email,
            password: await bcrypt.hash(password, 8) // Encrypts password
          })
          await newAccount.save() // Saves new account in mongodb
          const accountId = (await Account.find({ email: email })).map(Account => ({
            id: Account._id
          }))
          return res.status(201).send(accountId[0])
        } else if (uniqueEmail.length > 0) {
          return res.status(409).json({ description: 'Duplicated Keys' })
        } else {
          next(createError(500))
        }
      } else {
        next(createError(500))
      }
    } catch (err) {
      next(createError(500))
    }
  }
}
