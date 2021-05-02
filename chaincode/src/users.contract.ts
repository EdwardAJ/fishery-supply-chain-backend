/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { RegisterUserRequestInterface, LoginRequestInterface, EnrollAdminRequestInterface } from "./interfaces/request/auth-request.interface"
import { User } from "./models/base/user.model"
import { OrgRoles } from "./constants/organization.constant"
import { arePasswordsSame, getGeneratedPassword, getHashedPassword } from "./utils/password.util"
import { readState } from "./utils/util"
import { signAndGetJwt } from "./utils/jwt.util"


export class UsersContract extends Contract {
	public async createUser (context: Context, username: string,
    organization: string,role: string, hashedPassword: string
  ): Promise<void> {
    const user = { username, organization, role, hashedPassword }
    await context.stub.putState(username, Buffer.from(JSON.stringify(user)))
  }

  public async enrollAdmin (
    context: Context, requestBody: EnrollAdminRequestInterface
  ): Promise<string> {
    const { username, organization } = requestBody || {}
    if (!username || !organization) throw new Error("Please provide credentials!")

    const generatedPassword = getGeneratedPassword()
    const hashedPassword = await getHashedPassword(generatedPassword)
    await this.createUser(context, username, hashedPassword, OrgRoles.ADMIN, organization)
    return generatedPassword
  }

  public async registerUser (
    context: Context, adminUsername: string, requestBody: RegisterUserRequestInterface
  ): Promise<void> {
    const { username, organization, password } = requestBody || {}
    const adminUser = await this.getUserByUsername(context, adminUsername)
    if (!adminUser || adminUser?.Organization !== organization)
      throw new Error("Forbidden!")

    const hashedPassword = await getHashedPassword(password)
    await this.createUser(context, username, hashedPassword, OrgRoles.USER, organization)
    return
  }

  public async login (context: Context, requestBody: LoginRequestInterface): Promise<string> {
    const { username, password } = requestBody || {}
    if (!username || !password)
      throw new Error("Username or password is required")
    
    const { HashedPassword, Organization, Role } = await this.getUserByUsername(context, username)
    if (!await arePasswordsSame(password, HashedPassword)) {
      throw new Error("Wrong password")
    }

    return JSON.stringify({
      token: signAndGetJwt(username),
      organization: Organization,
      role: Role
    })
  }

  public async getUserByUsername (context: Context, username: string): Promise<User> {
    const user = await readState(context, username)
    const { username: name, organization, role, hashedPassword } = user
    return new User(name, organization, role, hashedPassword)
  }
}
