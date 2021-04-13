import express from "express"

import { authorizeToken } from "~/middleware/authorizeToken"
import { captureFisheryProduct } from "~/controllers/activities/capture-activity.controller"
import { getActivitiesChainByLotId } from "~/controllers/activities/get-activities-chain.controller"
import { supplyFisheryProduct } from "~/controllers/activities/supply-activity.controller"

const router = express.Router()
router.post("/capture", authorizeToken, captureFisheryProduct)
router.post("/supply", authorizeToken, supplyFisheryProduct)
router.get("/:lotId", authorizeToken, getActivitiesChainByLotId)

export {
  router as activityRouter
}