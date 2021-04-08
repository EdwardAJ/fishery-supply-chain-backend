import express from "express"

import { activityRouter } from "./activity.route"
import { enrollAdminRouter } from "./enroll-admin.route"
import { loginRouter } from "./login.route"

const router = express.Router()

router.use("/activity", activityRouter)
router.use("/login", loginRouter)
router.use("/enroll", enrollAdminRouter)

export { router as mainRouter }