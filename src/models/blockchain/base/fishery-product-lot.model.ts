import { ProductLotInterface } from "~/interfaces/product-lot.interface"

class FisheryProductLot {
  private readonly id: string
  private readonly weight: number
  private readonly commodityType: string
  private readonly activitiesChainId: string
  private activityId: string

  constructor (
    { id, weight, commodityType,
      activitiesChainId, activityId }: ProductLotInterface
  ) {
    this.id = id
    this.weight = weight
    this.commodityType = commodityType
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

  get ActivitiesChainId (): string {
    return this.activitiesChainId
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