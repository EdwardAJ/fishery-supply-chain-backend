/* eslint-disable @typescript-eslint/no-explicit-any */

import { ActivityContract } from "./activity.contract"
import { FisheryProductLotContract } from "./fishery-product-lot.contract"
import { UserContract } from "./user.contract"

export { ActivityContract } from "./activity.contract"
export { FisheryProductLotContract } from "./fishery-product-lot.contract"
export { UserContract } from "./user.contract"

export const contracts: any[] = [ActivityContract, FisheryProductLotContract, UserContract]
