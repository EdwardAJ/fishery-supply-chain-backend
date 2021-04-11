/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway } from "fabric-network"
import { getConnectionInfo, getWallet } from "~/utils/wallet.util"
import { Activity } from "~/models/blockchain/base/activity.model"
import { getOrgCredentials } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"

const invoke = async (
    orgName: string, username: string,
    chainCodeName: string, methodName: string,
    activity: Activity
  ): Promise<void> => {

  const { domain, mspId } = getOrgCredentials(orgName)
  const ccp = getConnectionInfo(domain, mspId)
  const wallet = await getWallet()

  // Check to see if we've already enrolled the user.
  const identity = await wallet.get(username)
  if (!identity) {
  logger.error(`Identity ${username} does not exist`)
    throw new Error(`An identity for the user ${username} does not exist in the wallet`)
  }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway()
  await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } })

  // TODO: change "channel1" to use process.env 
  const network = await gateway.getNetwork("channel1")
  const contract = network.getContract(chainCodeName)
  logger.info(`Submitting transaction to ${methodName} with params: %O`, activity)
  await contract.submitTransaction(methodName, activity.Id, JSON.stringify(activity))
  logger.info("Transaction has been submitted")

  gateway.disconnect()
}

export {
  invoke
}
