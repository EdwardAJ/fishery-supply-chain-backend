import express from "express"
import { getTotalWeight } from "~/controllers/weight/get/get-total-weight.controller"

const router = express.Router()
router.get("/", getTotalWeight)

export {
  router as aggregationRouter
}