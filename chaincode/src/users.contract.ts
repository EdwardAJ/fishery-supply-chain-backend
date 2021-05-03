/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { RegisterUserRequestInterface, LoginRequestInterface, EnrollRequestInterface } from "./interfaces/request/auth-request.interface"
import { User } from "./models/base/user.model"
import { OrgMspIdMap, OrgRoles } from "./constants/organization.constant"
import { arePasswordsSame, getGeneratedPassword, getHashedPassword } from "./utils/password.util"
import { readState } from "./utils/util"
import { signAndGetJwt, verifyJwtAndGetUsername } from "./utils/jwt.util"
import { ClientIdentity } from "fabric-shim"


export class UsersContract extends Contract {
	public async createUser (
    context: Context, username: string,
    organization: string,role: string, hashedPassword: string
  ): Promise<void> {
    const user = { username, organization, role, hashedPassword }
    await context.stub.putState(username, Buffer.from(JSON.stringify(user)))
  }

  public isAuthorized (context: Context, organization: string) {
    const clientId = new ClientIdentity(context.stub)
    const mspId = clientId.getMSPID()

    clientId.getAttributeValue("username")

    if (OrgMspIdMap[organization] === undefined) throw new Error ("Forbidden!")
    if (mspId !== OrgMspIdMap[organization]) throw new Error ("Forbidden!")
  }

  public async getUserByUsername (context: Context, username: string): Promise<User> {
    const user = await readState(context, username)
    const { username: name, organization, role, hashedPassword } = user
    return new User(name, organization, role, hashedPassword)
  }
}
