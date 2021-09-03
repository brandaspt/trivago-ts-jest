import { Document, Model } from "mongoose"

export interface IUser {
  name: string
  email: string
  password?: string
  facebookId?: string
  googleId?: string
  role: "host" | "guest"
  refreshToken?: string
}

export interface IUserDocument extends Document, IUser {}

export interface IUserModel extends Model<IUserDocument> {
  checkCredentials(email: string, password: string): Promise<null | IUserDocument>
}
