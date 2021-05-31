import express from "express"

import { activityRouter } from "./activity.route"
import { registerUserRouter } from "./register-user.route"
import { loginRouter } from "./login.route"
import { aggregationRouter } from "./aggregation.route"

const router = express.Router()

router.use("/activity", activityRouter)
router.use("/login", loginRouter)
router.use("/register", registerUserRouter)
router.use("/aggregation", aggregationRouter)

export { router as mainRouter }