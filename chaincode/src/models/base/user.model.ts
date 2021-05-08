class User {
  constructor (
    private readonly username: string,
    private readonly organization: string,
    private readonly role?: string,
    private readonly hashedPassword ?: string,
  ) {}

  get Username(): string {
    return this.username
  }

  get Organization(): string {
    return this.organization
  }

  get Role(): string {
    return this.role
  }

  get HashedPassword(): string {
    return this.hashedPassword
  }
}

export {
  User
}