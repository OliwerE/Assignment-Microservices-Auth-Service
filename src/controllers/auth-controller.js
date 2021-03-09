/**
 * Module represents auth controller.
 */

import { Account } from '../models/account-model.js'
import bcrypt from 'bcrypt'

export class AuthController {
  login (req, res, next) {
    try {
      // console.log(req.body)

      // res.json({ message: "login!!!" })
    } catch (error) {
      // ToDo: Skapa error!
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