// import { Response } from "~/models/response.model"
// import { Request, Response as ExpressResponse } from "express"

// import { Codes } from "~/constants/http/code.constant"
// import { User } from "~/models/blockchain/base/user.model"
// import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
// import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"

// import { getGeneratedUuid } from "~/utils/uuid.util"
// import { logger } from "~/utils/logger.util"
// import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
// import { invoke } from "~/services/invoke.service"
// import { getUserByUsername } from "~/services/user.service"
// import { OrgNames } from "~/constants/organization.constant"
// import { query } from "~/services/query.service"
// import { SupplyActivity } from "~/models/blockchain/supply/supply-activity.model"
// import { Storage } from "~/models/blockchain/supply/storage.model"
// import { Supplier } from "~/models/blockchain/supply/supplier.model"

// Specifying the type in the payload
// type = NORMAL: handle one lotId payload, normal supply chain
// type = SPLIT: split case: get multiple new lots information, make lotIds based on it, then split
// type = COMBINE: combine case: merge multiple lotIds to one

// const supplyFisheryProduct = async (req: Request, res: ExpressResponse):
//   Promise<ExpressResponse<Response>> => {
//     try {
//       const username = req.headers["username"] as string
//       const user = await getUserByUsername(username)
//       if (!user || user.organization !== OrgNames.ORG_2)
//         return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

//       const {
//         location: { latitude, longitude },
//         supplier: { id: supplierId, name: supplierName },
//         storage: { id: storageId, name: storageName },
//         lot: { ids : currentLotIds, new_fishery_product: newLot }
//       } = req.body

//       const parentActivityIds: string[] = []
//       const currentLots: FisheryProductLot[] = []
//       const activityListIds: string[] = []

//       // TODO: remove the activityListIds
//       // CURRENT_ASSUMPTION: user can combine the lots from the same activitiesListId
//       await currentLotIds.map(async (lotId: string) => {
//         const activitiesWithLotId = 
//           await query(user.organization, username, "basic", "getActivities", JSON.stringify({
//             selector: { currentLot: { id: lotId } }
//           }))

//           if (!activitiesWithLotId || !activitiesWithLotId.length)
//             return sendErrorResponse(res, "Previous activities do not exist")

//           const { activityListId, currentLot, id } = activitiesWithLotId[0].Record
//           parentActivityIds.push(id)
//           currentLots.push(currentLot)
//           activityListIds.push(activityListId)
//       })

//       let newProductLot: FisheryProductLot

//       // If user wants to join multiple lot ids, a new lot information must be provided
//       if (currentLotIds.length > 1) {
//         if (!newLot) return sendErrorResponse(res, "Please provide new lot information")
//         newProductLot = new FisheryProductLot(getGeneratedUuid(), newLot.weight, newLot.commodityType)
//       } else {
//         newProductLot = newLot
//           ? new FisheryProductLot(getGeneratedUuid(), newLot.weight, newLot.commodityType)
//           : currentLots[0]
//       }
      
//       const supplyActivity = new SupplyActivity(
//         getGeneratedUuid(), parentActivityIds, activityListIds[0],
//         newProductLot, new GPSLocation(latitude, longitude),
//         new User(username, user.organization),
//         new Date().toISOString(),
//         new Supplier(supplierId, supplierName),
//         new Storage(storageId, storageName)
//       )

//       await invoke(user.organization, username, "basic", "createActivity", supplyActivity)
//       return sendSuccessResponse(res, "Supplied!", { activity: supplyActivity })

//     } catch (error) {
//       logger.error(error)
//       return sendErrorResponse(res, error.message)
//     }
// }

// export {
//   supplyFisheryProduct
// }