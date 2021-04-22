import express from "express"
import { authorizeToken } from "~/middleware/authorizeToken"
import { getProductLots } from "~/controllers/product-lot/get/get-product-lot.controller"

const router = express.Router()
router.get("/", authorizeToken, getProductLots)

export {
  router as productLotRouter
}