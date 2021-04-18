class Identity {
  constructor (
    protected readonly id: string,
    protected readonly name: string
  ) {}

  get Id(): string {
    return this.id
  }
  
  get Name(): string {
    return this.name
  }
}

export { Identity }