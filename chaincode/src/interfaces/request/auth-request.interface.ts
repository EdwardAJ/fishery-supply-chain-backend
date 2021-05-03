import { TokenInterface } from "../base/token.interface";

interface LoginRequestInterface {
  username: string
  password: string
}

interface EnrollRequestInterface extends TokenInterface {
  username: string
  organization: string
}

interface RegisterUserRequestInterface extends EnrollRequestInterface {
  password: string
}

export {
  RegisterUserRequestInterface,
  LoginRequestInterface,
  EnrollRequestInterface
}

