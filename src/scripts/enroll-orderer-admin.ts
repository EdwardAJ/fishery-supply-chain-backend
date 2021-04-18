/*
 * SPDX-License-Identifier: Apache-2.0
 */

import dotenv from "dotenv"
dotenv.config()

import FabricCAServices from "fabric-ca-client"
import { Wallets, X509Identity } from "fabric-network"
import fs from "fs"
import path from "path"

import database from "~/database"
import { OrgNames, OrgRoles } from "~/constants/organization.constant"
import { insertUser } from "~/services/user.service"
import { getHashedPassword, getGeneratedPassword } from "~/utils/password.util"

const enrollOrdererAdmin = async (ordererAdminUsername: string) => {
  try {
    const ordererPassword = process.env.ORDERER_PASSWORD as string
    // load the network configuration
    const ccpPath = path.resolve(__dirname, "..", "..", "blockchain", "test-network","organizations","ordererOrganizations","example.com", "connection-orderer.json")
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"))

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities["ca.example.com"]
    const caTLSCACerts = caInfo.tlsCACerts.pem
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName)

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "blockchain", "wallet")
    const wallet = await Wallets.newFileSystemWallet(walletPath)

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(ordererAdminUsername)
    if (identity) {
        console.log(`An identity for the admin user ${ordererAdminUsername} already exists in the wallet`)
        return
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: ordererAdminUsername, enrollmentSecret: ordererPassword})
    const x509Identity: X509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: "OrdererMSP",
        type: "X.509",
    }
    await wallet.put(ordererAdminUsername, x509Identity)
    console.log(`Successfully enrolled admin user ${ordererAdminUsername} and imported it into the wallet`)

  } catch (error) {
      console.error(`Failed to enroll: ${error}`)
      process.exit(1)
  }
}



const main = async () => {
  try {
    await database.init()
    const ordererAdminUsername = process.env.ORDERER_ADMIN as string
    await enrollOrdererAdmin(ordererAdminUsername)
    
    const generatedPassword = getGeneratedPassword()
    console.log("generated password: ", generatedPassword)

    const hashedGeneratedPassword = await getHashedPassword(generatedPassword)
    await insertUser(ordererAdminUsername, hashedGeneratedPassword, OrgRoles.USER, OrgNames.ORG_ORDERER)
    process.exit(0)

  } catch (error) {
    console.error("error: ", error)
    process.exit(1)
  }
}

main()
