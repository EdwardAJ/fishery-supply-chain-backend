/*
 * SPDX-License-Identifier: Apache-2.0
 */

import dotenv from "dotenv"
dotenv.config()

import { OrgRoles } from "~/constants/organization.constant"
import { enrollAdminToBlockchain } from "~/services/enroll-admin.service"
import { registerUserToBlockchain } from "~/services/register-user.service"
import { getAppOrgAdminUsername, getOrgCredentials } from "~/utils/organization.util"
import { getHashedPassword, getGeneratedPassword } from "~/utils/password.util"
import { getConnectionInfo } from "~/utils/wallet.util"

const main = async () => {
  try {
    const generatedPassword = getGeneratedPassword()
    const hashedPassword = await getHashedPassword(generatedPassword)

    const { mspId } = getOrgCredentials()
    const ccp = getConnectionInfo(mspId)

    await enrollAdminToBlockchain(ccp)
    await registerUserToBlockchain(ccp, getAppOrgAdminUsername(), hashedPassword, OrgRoles.ADMIN)
    console.log(`${getAppOrgAdminUsername()} password: ${generatedPassword}`)
    process.exit(0) 

  } catch (error) {
    console.error("error: ", error)
    process.exit(1)
  }
}

main()
