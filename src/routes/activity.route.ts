import express from "express"

import { authorizeToken } from "~/middleware/authorizeToken"
import { captureFisheryProduct } from "~/controllers/activities/capture-activity.controller"

const router = express.Router()
router.post("/capture", authorizeToken, captureFisheryProduct)

export {
  router as activityRouter
}