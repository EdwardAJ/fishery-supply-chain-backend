/*
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from "fabric-ca-client"
import { X509Identity } from "fabric-network"
import { getOrgCredentials, getOrgAffiliation } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { getConnectionInfo, getWallet } from "~/utils/wallet.util"

const registerUserToBlockchain = async (orgName: string, username: string): Promise<string> => {
  const { adminUsername, domain, mspId } = getOrgCredentials(orgName)
  const ccp = getConnectionInfo(domain, mspId)
  const caInfo = ccp.certificateAuthorities[`ca.${domain}`]
  const ca = new FabricCAServices(caInfo.url)

  const wallet = await getWallet()
  // Check to see if we've already registered the user with username=username
  const userIdentity = await wallet.get(username)
  if (userIdentity) {
      logger.error(`Identity ${username} already exists`)
      throw new Error(`An identity for the user ${username} already exists in the wallet`)
  }
  const adminIdentity = await wallet.get(adminUsername)
  if (!adminIdentity) {
    logger.error("Admin has not been enrolled!")
    throw new Error("Admin has not been enrolled!")
  }

  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
  const adminUser = await provider.getUserContext(adminIdentity, adminUsername)

  logger.info(`Register username ${username}...`)

  // Register the user, enroll the user, and import the new identity into the wallet.
  const userPassword = await ca.register(
    { affiliation: getOrgAffiliation(mspId), enrollmentID: username, role: "client"
  }, adminUser)
  
  const { certificate, key } = await ca.enroll({ enrollmentID: username, enrollmentSecret: userPassword})
  const x509Identity: X509Identity = {
      credentials: {
          certificate,
          privateKey: key.toBytes(),
      },
      mspId,
      type: "X.509",
  }
  await wallet.put(username, x509Identity)
  logger.info(`Successfully enrolled user ${username} and imported it into the wallet`)
  return userPassword
}

export {
  registerUserToBlockchain
}