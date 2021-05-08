import { User } from "../../models/base/user.model"
import { FisheryProductLotRequestInterface } from "../request/requests.interface"

interface FisheryProductLotInterface extends FisheryProductLotRequestInterface {
  id: string
  activityId: string
  owner: User
}

export {
  FisheryProductLotInterface
}