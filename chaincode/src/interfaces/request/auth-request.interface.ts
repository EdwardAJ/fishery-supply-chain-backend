interface LoginRequestInterface {
  username: string
  password: string
}

interface EnrollAdminRequestInterface {
  username: string
  organization: string
}

interface RegisterUserRequestInterface extends EnrollAdminRequestInterface {
  adminUsername: string
  password: string
}

export {
  RegisterUserRequestInterface,
  LoginRequestInterface,
  EnrollAdminRequestInterface
}

