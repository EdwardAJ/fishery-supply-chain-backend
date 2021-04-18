import { Activity } from "../base/activity.model"
import { Supplier } from "./supplier.model"
import { Storage } from "./storage.model"
import { ActivityInterface } from "~/interfaces/activity.interface"
import { ProcessTo } from "./process-to.model"
import { GPSLocation } from "../base/gps-location.model"

class ProcessActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly supplier: Supplier,
    private readonly storage: Storage,
    private readonly processTo: ProcessTo,
    private readonly location: GPSLocation
  ) {
    super(baseActivityData, "Pengolahan")
  }

  get Supplier(): Supplier {
    return this.supplier
  }

  get Storage(): Storage {
    return this.storage
  }

  get ProcessTo(): ProcessTo {
    return this.processTo
  }

  get Location(): GPSLocation {
    return this.location
  }
}

export {
  ProcessActivity
}