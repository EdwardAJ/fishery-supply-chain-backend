import { Identity } from "../base/identity.model"

class Harbor extends Identity {
  constructor (
    id: string, name: string
  ){
    super(id, name)
  }
}

export {
  Harbor
}