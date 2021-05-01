class User {
  constructor (
    private readonly username: string | null,
    private readonly organizationName: string
  ) {}

  get Username(): string | null {
    return this.username
  }

  get OrganizationName(): string {
    return this.organizationName
  }
}

export {
  User
}