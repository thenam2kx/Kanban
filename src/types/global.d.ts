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
    permissions: {
      _id: string;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[]
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
    permissions: {
      _id: string;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[]
  }

  // interface ICustomer {
  //   _id: string;
  //   fullname: string;
  //   email: string;
  //   password: string;
  //   phone?: string;
  //   role: {
  //     _id: string;
  //     name: string
  //   }
  //   avatar?: string;
  //   gender: string;
  //   birthday?: Date;
  //   address?: {
  //     street: string;
  //     city: string;
  //     state: string;
  //     country: string;
  //   }
  //   isVerified?: boolean;
  //   verificationCode?: string;
  //   expiredVerificationCode?: Date;
  //   resetPasswordCode?: string;
  //   expiredResetPasswordCode?: string;
  //   resetPasswordDate?: Date;
  //   refresh_token?: string
  //   type: string;
  //   createdBy?: {
  //     _id: mongoose.Schema.Types.ObjectId;
  //     email: string;
  //   };
  //   updatedBy?: {
  //     _id: mongoose.Schema.Types.ObjectId;
  //     email: string;
  //   };
  //   deletedBy?: {
  //     _id: mongoose.Schema.Types.ObjectId;
  //     email: string;
  //   };
  //   createdAt?: Date;
  //   updatedAt?: Date;
  //   deletedAt?: Date;
  // }

  interface IMeta {
    current: number
    pages: number
    pageSize: number
    total: number
  }
  interface IResponseList<T>{
    result: T[]
    meta: IMeta
  }

  interface IRole {
    _id: string;
    name: string;
    isActive: boolean;
    description: string;
    permissions: {
      _id: string;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[]
  }
}
