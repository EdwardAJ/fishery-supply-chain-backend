import express from "express"

import { authorizeToken } from "~/middleware/authorizeToken"
import { capture } from "~/controllers/activities/capture/capture-activity.controller"
import { getActivitiesChainHistory } from "~/controllers/chain/get/get-activities-chain-history.controller"
import { split } from "~/controllers/activities/split/split-activity.controller"
import { combine } from "~/controllers/activities/combine/combine-activity.controller"
import { transfer } from "~/controllers/activities/transfer/transfer-activity.controller"
import { process } from "~/controllers/activities/process/process-activity.controller"
import { market } from "~/controllers/activities/market/market-activity.controller"

const router = express.Router()
router.post("/capture", authorizeToken, capture)
router.post("/split", authorizeToken, split)
router.post("/combine", authorizeToken, combine)
router.post("/transfer", authorizeToken, transfer)
router.post("/process", authorizeToken, process)
router.post("/market", authorizeToken, market)
router.get("/", getActivitiesChainHistory)

export {
  router as activityRouter
}