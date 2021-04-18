import express from "express"

import { authorizeToken } from "~/middleware/authorizeToken"
import { captureFisheryProduct } from "~/controllers/activities/capture-activity.controller"
import { getActivitiesChainByLotId } from "~/controllers/activities/get-activities-chain.controller"
import { processFisheryProduct } from "~/controllers/activities/process-activity.controller"

const router = express.Router()
router.post("/capture", authorizeToken, captureFisheryProduct)
router.post("/supply", authorizeToken, processFisheryProduct)
router.get("/:lotId", authorizeToken, getActivitiesChainByLotId)

export {
  router as activityRouter
}