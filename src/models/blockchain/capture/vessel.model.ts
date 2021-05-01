import { Identity } from "../base/identity.model"

class Vessel extends Identity {
  constructor (
    id: string, name: string
  ){
    super(id, name)
  }
}


export {
  Vessel
}