class FisheryProductLot {
  constructor (
    private readonly id: string,
    private readonly weight: number,
    private readonly commodityType: string,
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
}

export {
  FisheryProductLot
}