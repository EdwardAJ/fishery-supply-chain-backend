class User {
  constructor (
    private readonly username: string | null,
    private readonly organizationName: string | null
  ) {}

  get Username(): string | null {
    return this.username
  }

  get OrganizationName(): string | null {
    return this.organizationName
  }
}

export {
  User
}