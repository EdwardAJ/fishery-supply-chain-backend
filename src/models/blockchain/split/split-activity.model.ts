import { ActivityInterface } from "~/interfaces/activity.interface"
import { Activity } from "../base/activity.model"

class SplitActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface
  ) {
    super(baseActivityData, "Split")
  }
}

export {
  SplitActivity
}