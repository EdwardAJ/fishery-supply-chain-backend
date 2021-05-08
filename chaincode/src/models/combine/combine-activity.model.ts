import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { Activity } from "../base/activity.model"

class CombineActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface
  ) {
    super(baseActivityData)
  }
}

export {
  CombineActivity
}