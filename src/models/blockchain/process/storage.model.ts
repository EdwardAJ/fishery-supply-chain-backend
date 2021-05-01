import { Identity } from "../base/identity.model"

class Storage extends Identity {
  constructor (
    id: string, name: string
  ){
    super(id, name)
  }
}

export {
  Storage
}