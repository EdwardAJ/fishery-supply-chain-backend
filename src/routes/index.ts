import express from "express"

import { activityRouter } from "./activity.route"
import { enrollAdminRouter } from "./enroll-admin.route"
import { registerUserRouter } from "./register-user.route"
import { loginRouter } from "./login.route"
import { chainRouter } from "./chain.route"

const router = express.Router()

router.use("/activity", activityRouter)
router.use("/login", loginRouter)
router.use("/enroll", enrollAdminRouter)
router.use("/register", registerUserRouter)
router.use("/chain", chainRouter)

export { router as mainRouter }