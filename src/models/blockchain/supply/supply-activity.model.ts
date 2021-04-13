import { Activity } from "../base/activity.model"
import { Supplier } from "./supplier.model"
import { Storage } from "./storage.model"
import { ActivityInterface } from "~/interfaces/activity.interface"

class SupplyActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly supplier: Supplier,
    private readonly storage: Storage
  ) {
    super(baseActivityData)
  }

  get Supplier(): Supplier {
    return this.supplier
  }

  get Storage(): Storage {
    return this.storage
  }
}

export {
  SupplyActivity
}