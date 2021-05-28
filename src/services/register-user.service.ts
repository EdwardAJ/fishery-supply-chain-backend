/*
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from "fabric-ca-client"
import { X509Identity } from "fabric-network"
import { getOrgCredentials, getOrgAffiliation } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { getConnectionInfo, getWallet } from "~/utils/wallet.util"
import { OrgRoles } from "~/constants/organization.constant"

/*
 * In case of isOrderer = true, then:
 * The identity of user is identity of organization admin
 * The identity of admin is identity of orderer admin
 */

const registerUserToBlockchain = async (
  username: string, hashedPassword: string, role: string = OrgRoles.USER
): Promise<void> => {
  const orgCredential = getOrgCredentials()
  const ccp = getConnectionInfo(orgCredential.domain, orgCredential.mspId)
  const caInfo = ccp.certificateAuthorities[`ca.${orgCredential.domain}`]
  const ca = new FabricCAServices(caInfo.url)

  const wallet = await getWallet()
  const userIdentity = await wallet.get(username)
  if (userIdentity) {
      logger.error(`Identity ${username} already exists`)
      throw new Error(`An identity for the user ${username} already exists in the wallet`)
  }

  const blockchainAdminUsername = orgCredential.adminUsername
  const blockchainAdminIdentity = await wallet.get(blockchainAdminUsername)
  if (!blockchainAdminIdentity) {
    logger.error("Admin has not been enrolled!")
    throw new Error("Admin has not been enrolled!")
  }

  const provider = wallet.getProviderRegistry().getProvider(blockchainAdminIdentity.type)
  const blockchainAdmin = await provider.getUserContext(blockchainAdminIdentity, blockchainAdminUsername)

  const secret = await ca.register(
    {
      affiliation: getOrgAffiliation(orgCredential.mspId),
      enrollmentID: username,
      role: "client",
      attrs: [
        { name: "username", value: username, ecert: true },
        { name: "role", value: role, ecert: true },
        { name: "hashedPassword", value: hashedPassword, ecert: true}
      ]
  }, blockchainAdmin)
  
  const { certificate, key } = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: secret,
    attr_reqs: [
      { name: "username", optional: false },
      { name: "role", optional: false },
      { name: "hashedPassword", optional: false },
    ]
  })

  const x509Identity: X509Identity = {
    credentials: {
        certificate,
        privateKey: key.toBytes(),
    },
    mspId: orgCredential.mspId,
    type: "X.509",
  }

  await wallet.put(username, x509Identity)
  logger.info(`Successfully enrolled user ${username} and imported it into the wallet`)
}

export {
  registerUserToBlockchain
}