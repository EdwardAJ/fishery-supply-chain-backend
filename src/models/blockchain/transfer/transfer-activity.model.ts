import { Activity } from "../base/activity.model"
import { ActivityInterface } from "~/interfaces/activity.interface"
import { User } from "../base/user.model"

class TransferActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly from: User
  ) {
    super(baseActivityData, "Transfer")
  }

  get From(): User {
    return this.from
  }
}

export {
  TransferActivity
}