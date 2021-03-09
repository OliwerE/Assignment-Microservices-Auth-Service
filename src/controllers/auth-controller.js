/**
 * Module represents auth controller.
 */

import { Account } from '../models/account-model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { readFileSync } from 'fs'

export class AuthController {
  async login (req, res, next) {
    try {
      // console.log(req.body)
      const email = req.body.email
      const password = req.body.password

      console.log(email, ' ' , password)

      const user = (await Account.find({ email: email })).map(Account => ({
        id: Account._id,
        email: Account.email,
        password: Account.password
      }))

      // console.log(user[0])

      // validera email/lösen??

      const comparePassword = await bcrypt.compare(password, user[0].password)
      console.log(comparePassword)

      if (comparePassword === true) {
        const payload = {
          sub: user[0].email,
          x_permission_level: 1 // user.permissionLevel
        }
        const privateKey = readFileSync('private.pem', 'utf-8')
        const accessToken = jwt.sign(payload, privateKey, { // process.env.ACCESS_TOKEN_SECRET
          algorithm: 'RS256', // Byt till RS256! hs är symmetrisk!
          expiresIn: process.env.ACCESS_TOKEN_LIFE
        })

        // console.log(accessToken)

        // skapa refreshtoken?? rad 41: https://gitlab.lnu.se/1dv026/content/examples/example-restful-tasks-with-jwt/-/blob/master/src/controllers/api/account-controller.js
        res.status(200).json({ access_token: accessToken })
      } else {
        res.status(409).json({ message: "Invalid credentials!" })
      }
    } catch (err) {
      console.log(err)
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }

  async register (req, res, next) {

    try {
      console.log(req.body) // Funkar!

      const email = req.body.email
      const password = req.body.password

      // Fixa: Lägg till Dublicate keys err 409

      if (email === undefined || password === undefined) {
        return res.status(400).json({ message: "Enter both email and password!" })
      } else if (password.length > 1000) {
        return res.status(400).json({ message: "Password is too long (max 1000)." })
      } else if (password.length < 10) {
         return res.status(400).json({ message: "Password is too short (min 10)." })
      }

      if (email && password !== undefined) {
        const uniqueEmail = await Account.find({ email: email })
        if (uniqueEmail.length === 0) {
          const newAccount = new Account({
            email: email,
            password: await bcrypt.hash(password, 8) // Flytta ev till model, riskerar att sparas utan kryptering annars!
          })
          await newAccount.save() // Saves new account in mongodb
          const accountId = (await Account.find({ email: email })).map(Account => ({
            id: Account._id
          }))
          return res.status(201).send(accountId[0])
        } else {
          return res.json({ message: "Email is already registered!" })
        }
      } else {
        const error = new Error('Internal Server Error')
        error.status = 500
        next(error)
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
    }
  }
}