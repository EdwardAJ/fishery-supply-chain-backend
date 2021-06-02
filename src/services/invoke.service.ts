/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { getWallet, validateWallet } from "~/utils/wallet.util"
import { logger } from "~/utils/logger.util"
import { UserInterface } from "~/interfaces/user.interface"
import { Request } from "express"
import { gateways, connect } from "../gateway/index"

const invoke = async (
    req: Request, user: UserInterface, contractName: string, methodName: string,
    ...args: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {

  const { username } = user

  let connectionAttemptCount = 0
  while (connectionAttemptCount !== 2) {
    connectionAttemptCount++
    try {
      logger.info("Connecting to gateway")
      const network = await gateways[username].getNetwork("channel1")
      const contract = network.getContract("basic", contractName)
      logger.info("Submitting...")
      const result = await contract.submitTransaction(methodName, ...args)
      logger.info("Result...")
      return result
    } catch (error) {
      if (connectionAttemptCount === 2) throw error
      req.app.locals.ACTIVE_PEER_NUMBER = 1 - req.app.locals.ACTIVE_PEER_NUMBER
      const ccp = req.app.locals[`PEER_${req.app.locals.ACTIVE_PEER_NUMBER}_CCP`]
      const wallet = await getWallet()
      await validateWallet(wallet, username)
      await connect(ccp, wallet, username)
    }
  }
  return
}

export {
  invoke
}
