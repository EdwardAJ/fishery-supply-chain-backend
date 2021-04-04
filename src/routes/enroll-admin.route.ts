import { Router } from "express"
import { enrollAdmin } from "controllers/enroll-admin.controller"
import { authorizeToken } from "middleware/authorizeToken"

const router: Router = Router()
router.post("/", authorizeToken, enrollAdmin)

export {
  router as enrollAdminRouter
}