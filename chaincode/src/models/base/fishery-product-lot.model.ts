
import { FisheryProductLotInterface } from "../../interfaces/base/fishery-product-lot.interface"
import { User } from "./user.model"

class FisheryProductLot {
  private readonly id: string
  private readonly weight: number
  private readonly commodityType: string
  private owner: User
  private activityId: string

  constructor (
    { id, weight, commodityType, owner, activityId }: FisheryProductLotInterface
  ) {
    this.id = id
    this.weight = weight
    this.commodityType = commodityType
    this.owner = owner
    this.activityId = activityId
  }

  get Id (): string {
    return this.id
  }

  get Weight (): number {
    return this.weight
  }

  get CommodityType (): string {
    return this.commodityType
  }

  get Owner (): User {
    return this.owner
  }

  set Owner (owner: User) {
    this.owner = owner
  }

  get ActivityId (): string {
    return this.activityId
  }

  set ActivityId (activityId: string) {
    this.activityId = activityId
  }
}

export {
  FisheryProductLot
}