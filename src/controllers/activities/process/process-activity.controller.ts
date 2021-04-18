// import { Response } from "~/models/response.model"
// import { Request, Response as ExpressResponse } from "express"
// import { Codes } from "~/constants/http/code.constant"

// import { getGeneratedUuid } from "~/utils/uuid.util"
// import { logger } from "~/utils/logger.util"
// import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
// import { OrgNames } from "~/constants/organization.constant"
// import { ProcessActivity } from "~/models/blockchain/process/process-activity.model"

// import {
//   splitLotsAndGetActivities, updateLotAndGetActivities, updateActivitiesChain
// } from "~/utils/activities/process-activity.util"
// import { getAndValidateUser } from "~/utils/user.util"
// import { getCurrentLots, getParentActivityIds, validateLotInformation } from "~/utils/activities/product-lot.util"

// const processFisheryProduct = async (req: Request, res: ExpressResponse):
//   Promise<ExpressResponse<Response>> => {
//     try {
//       const username = req.headers["username"] as string
//       const user = await getAndValidateUser(username, OrgNames.ORG_2)

//       const { currentLot: { ids: currentLotIds }, newLots } = req.body
//       validateLotInformation(currentLotIds, newLots)
//       const currentLots = await getCurrentLots(currentLotIds, user)
//       const processActivityId = getGeneratedUuid()

//       // In case of multiple currentLotIds (merge multiple lots to one new lot),
//       // get activityId of every currentLotIds, assign it to parentActivityIds.
//       const parentActivityIds: string[] = getParentActivityIds(currentLots)
//       const activitiesChainId = currentLots[0].ActivitiesChainId
      
//       let processActivities: ProcessActivity[] = []
//       // Split one lot Id to multiple new lots.
//       newLots?.length > 0 ?
//         processActivities = await splitLotsAndGetActivities(
//           req, activitiesChainId, processActivityId, parentActivityIds, user)
//         :
//         // Do not split, just change the activityId of current lot.
//         processActivities = await updateLotAndGetActivities(
//           req, currentLots[0], processActivityId, parentActivityIds, user)

//       await updateActivitiesChain(activitiesChainId, processActivities, user)
//       return sendSuccessResponse(res, "Supplied!", { activities: processActivities })

//     } catch (error) {
//       logger.error(error)
//       return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
//     }
// }

// export {
//   processFisheryProduct
// }