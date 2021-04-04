import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import morgan from "morgan"
import cors from "cors"
import logger from "./utils/logger.util"
import routes from "./routes"
import { DEFAULT_PORT } from "./constants/env.constant"

const main = () => {
  logger.info("Initializing app")
  
  app.use(morgan("combined"))
  app.use(cors)
  app.use(express.json())
  app.use(routes)

  const PORT = process.env.PORT || DEFAULT_PORT
  app.listen(PORT, () => {
    logger.info(`Server is starting on port ${PORT}`)
  })
}

 main()