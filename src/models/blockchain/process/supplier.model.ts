import { Identity } from "../base/identity.model"

class Supplier extends Identity {
  constructor (
    id: string, name: string
  ){
    super(id, name)
  }
}

export {
  Supplier
}