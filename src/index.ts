import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import morgan from "morgan"
import cors from "cors"

import database from "~/database"
import { logger } from "~/utils/logger.util"
import { mainRoutes } from "~/routes"
import { DEFAULT_PORT } from "~/constants/env.constant"

const main = async () => {
  logger.info("Initializing app...")
  
  try {
    await database.init()
    logger.info("MongoDB successfully connected")

    app.use(morgan("combined"))
    app.use(cors)
    app.use(express.json())
    app.use(mainRoutes)

    const PORT = process.env.PORT || DEFAULT_PORT
    app.listen(PORT, () => {
      logger.info(`Server is starting on port ${PORT}`)
    })

  } catch (error) {
    logger.error(`Error happened: ${error}`)
  }
}

 main()