/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { Shim } from "fabric-shim"
import { LoginRequestInterface } from "./interfaces/request/auth-request.interface"
import { arePasswordsSame } from "./utils/password.util"
import { getUser } from "./utils/user.util"


export class UsersContract extends Contract {
  public async login(context: Context, requestBody: string): Promise<string> {
    const logger = Shim.newLogger("login")

    logger.debug("Login request: ", requestBody)
    const { username, password } = JSON.parse(requestBody) as LoginRequestInterface

    logger.debug("Username: ", username)
    logger.debug("Password: ", password)
    if (!username || !password)
      throw new Error("Username or password is required!")
    
    const user = getUser(context)
    if (!await arePasswordsSame(password, user.HashedPassword))
      throw new Error("Wrong password!")

    return JSON.stringify(user)
  }
}
