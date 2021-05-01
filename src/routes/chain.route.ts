import express from "express"

import { authorizeToken } from "~/middleware/authorizeToken"
import { getActivitiesChainHistory } from "~/controllers/chain/get/get-activities-chain-history.controller"

const router = express.Router()
router.get("/", authorizeToken, getActivitiesChainHistory)

export {
  router as chainRouter
}