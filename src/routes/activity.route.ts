import express from "express"

import { authorizeToken } from "~/middleware/authorizeToken"
import { capture } from "~/controllers/activities/capture/capture-activity.controller"
import { getActivitiesChainHistoryByLotId } from "~/controllers/activities/get/get-activities-chain-history.controller"
import { split } from "~/controllers/activities/split/split-activity.controller"
import { combine } from "~/controllers/activities/combine/combine-activity.controller"
import { transfer } from "~/controllers/activities/transfer/transfer-activity.controller"

const router = express.Router()
router.post("/capture", authorizeToken, capture)
router.post("/split", authorizeToken, split)
router.post("/combine", authorizeToken, combine)
router.post("/transfer", authorizeToken, transfer)
router.get("/:lotId", authorizeToken, getActivitiesChainHistoryByLotId)

export {
  router as activityRouter
}