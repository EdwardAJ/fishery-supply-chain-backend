import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import morgan from "morgan"
import cors from "cors"

import { logger } from "~/utils/logger.util"
import { mainRouter } from "~/routes"
import { DEFAULT_PORT } from "~/constants/env.constant"
import { getConnectionInfo, getWallet, validateWallet } from "./utils/wallet.util"
import { getAppOrgAdminUsername, getOrgCredentials } from "./utils/organization.util"
import { connect } from "./gateway"

const main = async () => {
  logger.info("Initializing app...")
  
  try {
    app.use(morgan("combined"))
    app.use(cors())
    app.use(express.json())
    app.use(mainRouter)
    app.locals.ACTIVE_PEER_NUMBER = 0

    const { mspId } = getOrgCredentials()
    app.locals.PEER_0_CCP = getConnectionInfo(mspId)
    app.locals.PEER_1_CCP = getConnectionInfo(mspId, 1)

    const username = getAppOrgAdminUsername()

    const wallet = await getWallet()
    await validateWallet(wallet, username)
    
    const ccp = app.locals.PEER_0_CCP
    await connect(ccp, wallet, username)

    const PORT = process.env.PORT || DEFAULT_PORT
    app.listen(PORT, () => {
      logger.info(`Server is starting on port ${PORT}`)
    })

  } catch (error) {
    logger.error(`Error happened: ${error}`)
  }
}

 main()