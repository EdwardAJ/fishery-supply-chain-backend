import express from "express"
import { enrollAdminRouter } from "./enroll-admin.route"
import { loginRouter } from "./login.route"

const router = express.Router()
router.use("/login", loginRouter)
router.use("/enroll", enrollAdminRouter)

export { router as mainRouter }