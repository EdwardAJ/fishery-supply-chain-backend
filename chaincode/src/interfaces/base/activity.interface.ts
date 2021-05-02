import { FisheryProductLot } from "../../models/base/fishery-product-lot.model"
import { IdentityInterface } from "./identity.interface"

interface ActivityInterface extends IdentityInterface {
  parentIds: string[] | null
  lot: FisheryProductLot
  createdAt: string
}

export {
  ActivityInterface
}