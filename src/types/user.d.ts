export {}

declare global {
  interface IUser {
    _id: string;
    fullname: string;
    email: string;
    password: string;
    phone?: string;
    role: {
      _id: string;
      name: string
    }
    avatar?: string;
    gender: string;
    birthday?: Date;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
    }
    type: string;
    isVerified?: boolean;
  }

}
