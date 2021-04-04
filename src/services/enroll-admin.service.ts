/*
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from "fabric-ca-client"
import { Wallets, X509Identity } from "fabric-network"
import fs from "fs"
import path from "path"
import {
  getOrgAdminUsername, getOrgPassword, getOrgDomain,
  getOrgMspId, getOrgConnectionFileName
} from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"

const enrollAdminToBlockchain = async (orgName: string): Promise<void> => {
  const orgAdminUsername = getOrgAdminUsername(orgName)
  const orgPassword = getOrgPassword(orgName)
  const orgDomain = getOrgDomain(orgName)
  const orgMspId = getOrgMspId(orgName)
  
  // load the network configuration
  const ccpPath = path.resolve(__dirname, "..", "..", "blockchain", "test-network","organizations", "peerOrganizations", orgDomain, getOrgConnectionFileName(orgMspId))
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"))

  // Create a new CA client for interacting with the CA.
  const caInfo = ccp.certificateAuthorities[`ca.${orgDomain}`]
  const caTLSCACerts = caInfo.tlsCACerts.pem
  const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName)

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "blockchain", "wallet")
  logger.info(`Creating wallet path at ${walletPath}...`)

  const wallet = await Wallets.newFileSystemWallet(walletPath)

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get(orgAdminUsername)
  if (identity) {
      logger.error(`Identity ${orgAdminUsername} already exists`)
      throw new Error(`An identity for the admin user ${orgAdminUsername} already exists in the wallet`)
  }

  // Enroll the admin user, and import the new identity into the wallet.
  logger.info(`Enrolling admin ${orgAdminUsername}...`)
  const enrollment = await ca.enroll({ enrollmentID: orgAdminUsername, enrollmentSecret: orgPassword})
  const x509Identity: X509Identity = {
      credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
  }
  await wallet.put(orgAdminUsername, x509Identity)
  logger.info(`Successfully enrolled admin user ${orgAdminUsername} and imported it into the wallet`)
}

export {
  enrollAdminToBlockchain
}