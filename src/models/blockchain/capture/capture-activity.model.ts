import { Harbor } from "./harbor.model"
import { Vessel } from "./vessel.model"
import { Activity } from "../base/activity.model"
import { ActivityInterface } from "~/interfaces/activity.interface"

class CaptureActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly vessel: Vessel,
    private readonly harbor: Harbor
  ) {
    super(baseActivityData)
  }

  get Vessel() : Vessel {
    return this.vessel
  }

  get Harbor(): Harbor {
    return this.harbor
  }
}

export {
  CaptureActivity
}