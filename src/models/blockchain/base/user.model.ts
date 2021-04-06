class User {
  constructor (
    private readonly _username: string,
    private readonly _organizationId: string
  ) {}

  get username(): string {
    return this._username
  }

  get organizationId(): string {
    return this._organizationId
  }
}

export {
  User
}