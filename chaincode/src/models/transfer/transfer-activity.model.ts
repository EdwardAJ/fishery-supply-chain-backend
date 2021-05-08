import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { Activity } from "../base/activity.model"
import { User } from "../base/user.model"

class TransferActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly from: User
  ) {
    super(baseActivityData)
  }

  get From (): User {
    return this.from
  }
}

export {
  TransferActivity
}