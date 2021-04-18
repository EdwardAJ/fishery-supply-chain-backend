
import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { User } from "~/models/blockchain/base/user.model"

interface ActivityInterface {
  id: string;
  parentIds: string[] | null;
  lot: FisheryProductLot;
  owner: User;
  createdAt: string
}

export {
  ActivityInterface
}