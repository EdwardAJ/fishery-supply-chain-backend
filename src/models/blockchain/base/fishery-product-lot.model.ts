class FisheryProductLot {
  constructor (
    private readonly id: string,
    private readonly weight: number,
    private readonly commodityType: string,
    private readonly activitiesChainId: string
  ) {}

  get Id(): string {
    return this.id
  }

  get Weight(): number {
    return this.weight
  }

  get CommodityType(): string {
    return this.commodityType
  }

  get ActivitiesChainId(): string {
    return this.activitiesChainId
  }
}

export {
  FisheryProductLot
}