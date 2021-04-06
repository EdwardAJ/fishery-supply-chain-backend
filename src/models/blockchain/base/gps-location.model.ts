class GPSLocation {
  constructor(
    private readonly _latitude: number,
    private readonly _longitude: number
  ) {}

  get latitude(): number {
    return this._latitude
  }

  get longitude(): number {
    return this._longitude
  }
}

export {
  GPSLocation
}