import express from "express"
import { registerUser } from "~/controllers/register-user.controller"
import { authorizeToken } from "~/middleware/authorizeToken"

const router = express.Router()
router.post("/", authorizeToken, registerUser)

export {
  router as registerUserRouter
}