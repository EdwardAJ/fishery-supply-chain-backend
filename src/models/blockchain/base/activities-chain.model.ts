import { Activity } from "./activity.model"

class ActivitiesChain {
  constructor (
    protected readonly id: string,
    protected readonly activities: Activity[]
  ){}
  
  get Id(): string {
    return this.id
  }

  get Activities(): Activity[] {
    return this.activities
  }
}

export {
  ActivitiesChain
}