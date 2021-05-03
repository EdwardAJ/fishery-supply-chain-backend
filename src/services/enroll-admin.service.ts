/*
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from "fabric-ca-client"
import { X509Identity } from "fabric-network"
import { getOrgCredentials } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { getConnectionInfo, getWallet } from "~/utils/wallet.util"

const enrollAdminToBlockchain = async (orgName: string): Promise<void> => {
  const { adminUsername, password, domain, mspId } = getOrgCredentials(orgName)
  const ccp = getConnectionInfo(domain, mspId)

  // Create a new CA client for interacting with the CA.
  const caInfo = ccp.certificateAuthorities[`ca.${domain}`]
  const caTLSCACerts = caInfo.tlsCACerts.pem
  const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName)

  const wallet = await getWallet()
  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get(adminUsername)
  if (identity) {
      logger.error(`Identity ${adminUsername} already exists`)
      throw new Error(`An identity for the admin user ${adminUsername} already exists in the wallet`)
  }

  // Enroll the admin user, and import the new identity into the wallet.
  logger.info(`Enrolling admin ${adminUsername}...`)
  const { certificate, key } =
    await ca.enroll({ enrollmentID: adminUsername, enrollmentSecret: password })

  const x509Identity: X509Identity = {
      credentials: {
          certificate,
          privateKey: key.toBytes(),
      },
      mspId,
      type: "X.509",
  }
  await wallet.put(adminUsername, x509Identity)
  logger.info(`Successfully enrolled admin user ${adminUsername} and imported it into the wallet`)
}

export {
  enrollAdminToBlockchain
}