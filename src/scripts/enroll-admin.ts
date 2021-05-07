/*
 * SPDX-License-Identifier: Apache-2.0
 */

import dotenv from "dotenv"
dotenv.config()

import { OrgNames, OrgRoles } from "~/constants/organization.constant"
import { enrollAdminToBlockchain } from "~/services/enroll-admin.service"
import { registerUserToBlockchain } from "~/services/register-user.service"
import { getAppOrgAdminUsername } from "~/utils/organization.util"
import { getHashedPassword, getGeneratedPassword } from "~/utils/password.util"

const main = async () => {
  try {
    const organizations = [OrgNames.ORG_1, OrgNames.ORG_2, OrgNames.ORG_3]
    for (const organization of organizations) {
      const generatedPassword = getGeneratedPassword()
      const hashedPassword = await getHashedPassword(generatedPassword)
      await enrollAdminToBlockchain(organization)
      await registerUserToBlockchain(organization, getAppOrgAdminUsername(organization), hashedPassword, OrgRoles.ADMIN)
      console.log(`${getAppOrgAdminUsername(organization)} password: ${generatedPassword}`)
    }
    process.exit(0) 

  } catch (error) {
    console.error("error: ", error)
    process.exit(1)
  }
}

main()
