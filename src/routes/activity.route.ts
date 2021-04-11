import express from "express"

import { authorizeToken } from "~/middleware/authorizeToken"
import { captureFisheryProduct } from "~/controllers/activities/capture-activity.controller"
import { getActivitiesByLotId } from "~/controllers/activities/get-activity.controller"
import { supplyFisheryProduct } from "~/controllers/activities/supply-activity.controller"

const router = express.Router()
router.post("/capture", authorizeToken, captureFisheryProduct)
router.post("/supply", authorizeToken, supplyFisheryProduct)
router.get("/:lotId", authorizeToken, getActivitiesByLotId)

export {
  router as activityRouter
}