/**
 * Module represents auth controller.
 */

import { Account } from '../models/account-model.js'

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
          // Lägg till!
          res.json({ message: "Email is unique!" }) // Fix!
        }


        console.log(uniqueEmail.length)
      } else {
        res.json({ message: "Enter both email and password!" }) // Fix!
      }

      // res.json({ message: "register!!!" })
    } catch (error) {
      // ToDo: Skapa error!
    }
  }
}