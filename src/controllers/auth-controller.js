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
      // console.log(req.body) // Funkar!

      const email = req.body.email
      const password = req.body.password
      
      console.log(email, ' , ', password)

      // kontrollera password krav och om email är en email

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
          res.status(201).send(accountId[0])
        } else {
          res.json({ message: "Email is already registered!" })
        }
      } else {
        res.json({ message: "Enter both email and password!" }) // Fix!
      }
    } catch (err) {
      const error = new Error('Internal Server Error')
      error.status = 500
      next(error)
      

    }
  }
}