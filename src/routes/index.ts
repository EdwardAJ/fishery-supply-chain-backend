import express from "express"
import { enrollAdminRouter } from "./enroll-admin.route"

const router = express.Router()
router.use("/enroll", enrollAdminRouter)

export { router as mainRouter }