class FisheryProductLot {
  constructor (
    private readonly _id: string,
    private readonly _weight: number,
    private readonly _commodityType: string,
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id
  }

  get weight(): number {
    return this._weight
  }

  get commodityType(): string {
    return this._commodityType
  }

  get createdAt(): Date {
    return this._createdAt
  }
}

export {
  FisheryProductLot
}