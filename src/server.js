/**
 * Server configuration module.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'

/**
 * Function represents an Express web server configuration.
 */
const startApplication = async () => {
  const app = express()

  await connectDB(app) // connects to mongoDB and configures session options

  // const fullDirName = dirname(fileURLToPath(import.meta.url))

  app.use(helmet()) // Security http headers

  app.use(logger('dev'))

  app.use(express.json())

  // Session options configured in ./config/mongoose.js

  app.use('/', router)

  app.use((err, req, res, next) => {
    /* Fixa alla Error koder!
    if (err.status === 403) {
      return res.status(403).sendFile(join(fullDirName, 'views', 'errors', '403.html'))
    }
    */

    if (err.status === 404) {
      return res.status(404).json({ message: "Not Found", status: "404" })
    }

    if (err.status === 500) {
      return res.status(500).json({ message: "Internal Server Error", status: "500" })
    }
  })

  app.listen(process.env.PORT, () => {
    console.log(`Listens for localhost@${process.env.PORT}`)
    console.log('ctrl + c to terminate')
  })
}

startApplication()
