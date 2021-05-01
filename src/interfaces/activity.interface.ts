
import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"

interface ActivityInterface {
  id: string
  parentIds: string[] | null
  lot: FisheryProductLot
  createdAt: string
}

export {
  ActivityInterface
}