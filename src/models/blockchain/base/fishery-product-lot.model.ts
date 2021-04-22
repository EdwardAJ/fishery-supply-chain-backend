import { ProductLotInterface } from "~/interfaces/product-lot.interface"
import { Harbor } from "../capture/harbor.model"
import { Vessel } from "../capture/vessel.model"

class FisheryProductLot {
  private readonly id: string
  private readonly weight: number
  private readonly commodityType: string
  private readonly activitiesChainId: string
  private activityId: string

  constructor (
    { id, weight, commodityType,
      activitiesChainId, activityId }: ProductLotInterface,
    private harbor?: Harbor,
    private vessel?: Vessel
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

  get Harbor (): Harbor | undefined {
    return this.harbor
  }

  set Harbor (harbor: Harbor | undefined) {
    this.harbor = harbor
  }

  get Vessel (): Vessel | undefined {
    return this.vessel
  }

  set Vessel (vessel: Vessel | undefined) {
    this.vessel = vessel
  }
}

export {
  FisheryProductLot
}