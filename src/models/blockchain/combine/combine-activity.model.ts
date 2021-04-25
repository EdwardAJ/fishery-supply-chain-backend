import { ActivityInterface } from "~/interfaces/activity.interface"
import { ParentInterface } from "~/interfaces/parent.interface"
import { Activity } from "../base/activity.model"

class CombineActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly parents: ParentInterface[] | null
  ) {
    super(baseActivityData, "Gabung")
  }

  get Parents(): ParentInterface[] | null {
    return this.parents
  }
}

export {
  CombineActivity
}