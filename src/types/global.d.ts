export {}

declare global {

  interface IBackendResponse<T> {
    error?: string | string[]
    message: string | string[]
    statusCode: number | string
    data?: T
  }

  interface ISignin {
    username: string
    password: string
  }

  interface ISigninResponse {
    user: {
      _id: string
      email: string
      phone: string
      fullname: string
      role: {
        _id: string
        name: string
      }
      permissions: string[]
    }
    access_token: string
  }

  interface ISignup {
    email: string
    fullname: string
    password: string
  }

  interface IUserAuth {
    _id: string
    email: string
    phone: string
    fullname: string
    role: {
      _id: string
      name: string
    }
    permissions: string[]
  }

  interface IUserAccount {
    _id: string
    fullname: string
    email: string
    phone: string
    role: {
      _id: string
      name: string
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    permissions: any[]
  }
}
