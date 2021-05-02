import { Activity } from "../base/activity.model"
import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { IdentityInterface } from "../../interfaces/base/identity.interface"
import { LocationInterface } from "../../interfaces/base/location.interface"

class CaptureActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly harbor: IdentityInterface,
    private readonly vessel: IdentityInterface,
    private readonly location: LocationInterface
  ) {
    super(baseActivityData)
  }

  get Vessel() : IdentityInterface {
    return this.vessel
  }

  get Harbor(): IdentityInterface {
    return this.harbor
  }

  get Location(): LocationInterface {
    return this.location
  }
}

export {
  CaptureActivity
}