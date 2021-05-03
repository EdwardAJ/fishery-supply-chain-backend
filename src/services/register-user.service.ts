/*
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from "fabric-ca-client"
import { X509Identity } from "fabric-network"
import { getOrgCredentials, getOrgAffiliation, getOrgAdminUsername } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { getConnectionInfo, getWallet } from "~/utils/wallet.util"
import { OrgNames, OrgRoles } from "~/constants/organization.constant"

const registerUserToBlockchain = async (
  orgName: string, username: string, hashedPassword: string, isOrderer?: boolean
): Promise<void> => {
  const orgCredential = getOrgCredentials(orgName)
  const ccp = getConnectionInfo(orgCredential.domain, orgCredential.mspId)
  const caInfo = ccp.certificateAuthorities[`ca.${orgCredential.domain}`]
  const ca = new FabricCAServices(caInfo.url)

  const wallet = await getWallet()
  const userIdentity = await wallet.get(username)
  if (userIdentity) {
      logger.error(`Identity ${username} already exists`)
      throw new Error(`An identity for the user ${username} already exists in the wallet`)
  }

  let adminIdentity = null
  let adminUsername = orgCredential.adminUsername
  if (isOrderer) {
    adminUsername = getOrgAdminUsername(OrgNames.ORG_ORDERER)
  }

  adminIdentity = await wallet.get(adminUsername)
  if (!adminIdentity) {
    logger.error("Admin has not been enrolled!")
    throw new Error("Admin has not been enrolled!")
  }

  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
  const adminUser = await provider.getUserContext(adminIdentity, adminUsername)
  logger.info(`Register username ${username}...`)

  await ca.register(
    {
      affiliation: getOrgAffiliation(orgCredential.mspId),
      enrollmentID: username,
      role: "client",
      attrs: [
        { name: "username", value: username, ecert: true },
        { name: "role", value: OrgRoles.USER, ecert: true },
        { name: "hashedPassword", value: hashedPassword, ecert: true}
      ]
  }, adminUser)
  
  const { certificate, key } = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: hashedPassword,
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