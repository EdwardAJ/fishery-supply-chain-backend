import { FisheryProductLotInterface } from "../base/fishery-product-lot.interface"
import { IdentityInterface } from "../base/identity.interface"
import { LocationInterface } from "../base/location.interface"

interface LoginRequestInterface {
  username: string
  password: string
  organization: string
}

interface ActivityRequestInterface {  
  createdAt: string
}

interface CaptureRequestInterface extends ActivityRequestInterface {
  location: LocationInterface
  lot: FisheryProductLotRequestInterface
  newLotId: string
  newActivityId: string
  vessel: IdentityInterface
  harbor: IdentityInterface
}

interface CombineRequestInterface extends ActivityRequestInterface {
  currentLot: {
    ids: string[]
  }
  newLot: FisheryProductLotRequestInterface
  newActivityId: string
  newLotId: string
}

interface SplitRequestInterface extends ActivityRequestInterface {
  currentLot: { id: string }
  newLots: FisheryProductLotInterface[]
  newLotIds: string[]
  newActivityIds: string[]
}

interface TransferRequestInterface extends ActivityRequestInterface {
  currentLot: { id: string }
  toUsername: string
  toOrganization: string
  newActivityId: string
}

interface ProcessRequestInterface extends ActivityRequestInterface {
  currentLot: { id: string }
  supplier: IdentityInterface
  storage: IdentityInterface
  processTo: IdentityInterface
  location: LocationInterface
  newActivityId: string
}

interface MarketRequestInterface extends ActivityRequestInterface {
  currentLot: { id: string }
  location: LocationInterface
  marketTo: IdentityInterface
  newActivityId: string
}

interface FisheryProductLotRequestInterface {
  weight: number
  commodityType: string
}


export {
  ActivityRequestInterface,
  LoginRequestInterface,
  CombineRequestInterface,
  SplitRequestInterface,
  TransferRequestInterface,
  FisheryProductLotRequestInterface,
  CaptureRequestInterface,
  ProcessRequestInterface,
  MarketRequestInterface
}

