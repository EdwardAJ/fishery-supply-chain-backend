/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway } from "fabric-network"
import { getWallet } from "~/utils/wallet.util"
import { logger } from "~/utils/logger.util"
import { UserInterface } from "~/interfaces/user.interface"
import { Request } from "express"

// TODO: refactor
const query = async (
  req: Request, user: UserInterface, contractName: string, methodName: string, stateKey: string
): Promise<any> => {

  const { username } = user
  const wallet = await getWallet()

  const identity = await wallet.get(username)
  if (!identity) {
    logger.error(`Identity ${username} does not exist`)
    throw new Error(`An identity for the user ${username} does not exist in the wallet`)
  }

  const gateway = new Gateway()

  let connectionAttemptCount = 0
  // Connect to peer0 or peer1 first, then retry the request.
  while (connectionAttemptCount !== 2) {
    connectionAttemptCount++
    try {
      logger.info(`Current active peer: ${req.app.locals.ACTIVE_PEER_NUMBER}`)
      const ccp = req.app.locals[`PEER_${req.app.locals.ACTIVE_PEER_NUMBER}_CCP`]
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: true },
        eventHandlerOptions: {
          strategy: null
        }
      })
      const network = await gateway.getNetwork("channel1")
      const contract = network.getContract("basic", contractName)
      const result = await contract.evaluateTransaction(methodName, stateKey)
      gateway.disconnect()
      return result
    } catch (error) {
      if (connectionAttemptCount === 2) throw error
      req.app.locals.ACTIVE_PEER_NUMBER = 1 - req.app.locals.ACTIVE_PEER_NUMBER
    }
  }
  
  return
}

export {
  query
}
