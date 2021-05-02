
import { FisheryProductLotInterface } from "../../interfaces/base/fishery-product-lot.interface"
import { IdentityInterface } from "../../interfaces/base/identity.interface"
import { User } from "./user.model"

class FisheryProductLot {
  private readonly id: string
  private readonly weight: number
  private readonly commodityType: string
  private owner: User
  private readonly activitiesChainId: string
  private activityId: string

  constructor (
    { id, weight, commodityType, owner,
      activitiesChainId, activityId }: FisheryProductLotInterface,
    private harbor?: IdentityInterface,
    private vessel?: IdentityInterface
  ) {
    this.id = id
    this.weight = weight
    this.commodityType = commodityType
    this.owner = owner
    this.activitiesChainId = activitiesChainId
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

  get ActivitiesChainId (): string {
    return this.activitiesChainId
  }

  get ActivityId (): string {
    return this.activityId
  }

  set ActivityId (activityId: string) {
    this.activityId = activityId
  }

  get Harbor (): IdentityInterface | undefined {
    return this.harbor
  }

  set Harbor (harbor: IdentityInterface | undefined) {
    this.harbor = harbor
  }

  get Vessel (): IdentityInterface | undefined {
    return this.vessel
  }

  set Vessel (vessel: IdentityInterface | undefined) {
    this.vessel = vessel
  }
}

export {
  FisheryProductLot
}