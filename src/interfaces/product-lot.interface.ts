import { User } from "~/models/blockchain/base/user.model"

interface ProductLotRequestBodyInterface {
  weight: number
  commodityType: string
}

interface ProductLotInterface extends ProductLotRequestBodyInterface {
  id: string
  activitiesChainId: string
  activityId: string
  owner: User
}

export {
  ProductLotInterface,
  ProductLotRequestBodyInterface
}