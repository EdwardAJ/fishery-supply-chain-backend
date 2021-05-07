import { IdentityInterface } from "../base/identity.interface"
import { LocationInterface } from "../base/location.interface"
import { FisheryProductLotRequestInterface } from "./fishery-product-lot-request.interface"


interface CaptureRequestInterface {
  location: LocationInterface
  fisheryProduct: FisheryProductLotRequestInterface
  vessel: IdentityInterface
  harbor: IdentityInterface,
  newLotId: string,
  captureActivityId: string,
  createdAt: string
}

export {
  CaptureRequestInterface
}