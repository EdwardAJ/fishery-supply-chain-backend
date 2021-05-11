import { Activity } from "../base/activity.model"
import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { IdentityInterface } from "../../interfaces/base/identity.interface"
import { LocationInterface } from "../../interfaces/base/location.interface"

class ProcessActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly supplier: IdentityInterface,
    private readonly storage: IdentityInterface,
    private readonly processTo: IdentityInterface,
    private readonly location: LocationInterface
  ) {
    super(baseActivityData)
  }

  get Supplier() : IdentityInterface {
    return this.supplier
  }

  get Storage(): IdentityInterface {
    return this.storage
  }

  get ProcessTo(): IdentityInterface { 
    return this.processTo
  }

  get Location(): LocationInterface {
    return this.location
  }
}

export {
  ProcessActivity
}