import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { Activity } from "../base/activity.model"

class SplitActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface
  ) {
    super(baseActivityData)
  }
}

export {
  SplitActivity
}