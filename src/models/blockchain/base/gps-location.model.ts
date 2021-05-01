class GPSLocation {
  constructor(
    private readonly latitude: number,
    private readonly longitude: number
  ) {}

  get Latitude(): number {
    return this.latitude
  }

  get Longitude(): number {
    return this.longitude
  }
}

export {
  GPSLocation
}