/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway } from "fabric-network"
import { getConnectionInfo, getWallet } from "~/utils/wallet.util"
import { getOrgCredentials } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { UserInterface } from "~/interfaces/user.interface"
import { Request } from "express"


const invoke = async (
    req: Request, user: UserInterface, contractName: string, methodName: string,
    ...args: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {

  const { username } = user
  
  const wallet = await getWallet()
  const identity = await wallet.get(username)
  if (!identity) {
    logger.error(`Identity ${username} does not exist`)
    throw new Error(`An identity for the user ${username} does not exist in the wallet`)
  }

  const { domain, mspId } = getOrgCredentials()
  const gateway = new Gateway()

  let connectionAttemptCount = 0
  // Connect to peer0 or peer1 first, then retry the request.
  while (connectionAttemptCount !== 2) {
    connectionAttemptCount++
    try {
      const ccp = getConnectionInfo(domain, mspId, req.app.locals.ACTIVE_PEER_NUMBER)
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } })
      const network = await gateway.getNetwork("channel1")
      const contract = network.getContract("basic", contractName)
      const result = await contract.submitTransaction(methodName, ...args)
      gateway.disconnect()
      return result
    } catch (error) {
      if (connectionAttemptCount === 2) throw error
      if (error.message.includes("DiscoveryService has failed to return results")) {
        req.app.locals.ACTIVE_PEER_NUMBER ^= req.app.locals.ACTIVE_PEER_NUMBER
      }
    }
  }
  return
}

export {
  invoke
}
