import { Activity } from "./activity.model"

class ActivitiesChain {
  constructor (
    protected readonly id: string,
    protected readonly activityList: Activity[]
  ){}
  
  get Id(): string {
    return this.id
  }

  get ActivityList(): Activity[] {
    return this.activityList
  }
}

export {
  ActivitiesChain
}