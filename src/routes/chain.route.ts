import express from "express"

import { getActivitiesChainHistory } from "~/controllers/chain/get/get-activities-chain-history.controller"

const router = express.Router()
router.get("/", getActivitiesChainHistory)

export {
  router as chainRouter
}