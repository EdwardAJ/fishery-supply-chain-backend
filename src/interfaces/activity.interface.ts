
import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { User } from "~/models/blockchain/base/user.model"

interface ActivityInterface {
  id: string;
  parentIds: string[] | null;
  currentLot: FisheryProductLot;
  location: GPSLocation;
  owner: User;
  createdAt: string
}

export {
  ActivityInterface
}