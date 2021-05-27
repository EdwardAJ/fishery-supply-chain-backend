import express from "express"
import { getProductLots } from "~/controllers/product-lot/get/get-product-lots.controller"

const router = express.Router()
router.get("/", getProductLots)

export {
  router as productLotRouter
}