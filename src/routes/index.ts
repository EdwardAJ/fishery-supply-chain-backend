import { Router } from "express"
import { enrollAdminRouter } from "./enroll-admin.route"

const router: Router = Router()
router.use("/enroll-admin", enrollAdminRouter)

export { router as mainRoutes }