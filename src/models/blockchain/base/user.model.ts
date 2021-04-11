class User {
  constructor (
    private readonly username: string,
    private readonly organizationId: string
  ) {}

  get Username(): string {
    return this.username
  }

  get OrganizationId(): string {
    return this.organizationId
  }
}

export {
  User
}