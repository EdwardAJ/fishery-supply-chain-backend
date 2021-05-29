import express from "express"

import { activityRouter } from "./activity.route"
import { registerUserRouter } from "./register-user.route"
import { loginRouter } from "./login.route"
import { chainRouter } from "./chain.route"
import { productLotRouter } from "./product-lot.route"

const router = express.Router()

router.use("/activity", activityRouter)
router.use("/login", loginRouter)
router.use("/register", registerUserRouter)
router.use("/chain", chainRouter)
router.use("/lot", productLotRouter)

export { router as mainRouter }