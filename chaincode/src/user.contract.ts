/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { LoginRequestInterface } from "./interfaces/request/requests.interface"
import { getUser, comparePasswordAndHashedPassword } from "./utils/user.util"


export class UserContract extends Contract {
  public async login(context: Context, requestBody: string): Promise<string> {
    const { username, password, organization } = JSON.parse(requestBody) as LoginRequestInterface
    if (!username || !password || !organization)
      throw new Error("Username or password or organization is required!")
    
    const user = getUser(context, true)
    const arePasswordsSame = await comparePasswordAndHashedPassword(password, user.HashedPassword)
    if (!arePasswordsSame)
      throw new Error("Wrong password!")

    if (user.Organization !== organization)
      throw new Error("Wrong organization!")

    return JSON.stringify(user)
  }
}
