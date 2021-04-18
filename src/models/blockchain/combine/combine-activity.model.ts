import { ActivityInterface } from "~/interfaces/activity.interface"
import { Activity } from "../base/activity.model"

class CombineActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly parentActivitiesChainIds: string[] | null
  ) {
    super(baseActivityData, "Gabung")
  }

  get ParentActivitiesChainIds(): string[] | null {
    return this.parentActivitiesChainIds
  }
}

export {
  CombineActivity
}