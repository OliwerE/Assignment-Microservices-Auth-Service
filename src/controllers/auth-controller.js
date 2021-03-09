/**
 * Module represents auth controller.
 */

export class AuthController {
  login (req, res, next) {
    res.json({ message: "login!!!" })
  }

  register (req, res, next) {
    res.json({ message: "register!!!" })
  }
}