import { Activity } from "../../models/base/activity.model"
import { FisheryProductLot } from "../../models/base/fishery-product-lot.model"

interface LotAndActivityInterface {
  lot: FisheryProductLot,
  activity: Activity
}

export {
  LotAndActivityInterface
}