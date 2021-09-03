import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { IUserDocument, IUserModel } from "../typings/users"

const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  facebookId: String,
  googleId: String,
  role: {
    type: String,
    required: true,
    enum: ["host", "guest"],
  },
  refreshToken: String,
})

UserSchema.pre("save", async function (next) {
  const newUser = this
  const plainText = newUser.password
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainText!, 10)
  }
  next()
})

UserSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const hashedPassword = user.password
    const isMatch = await bcrypt.compare(password, hashedPassword!)
    if (isMatch) return user
    else return null
  } else {
    return null
  }
}
UserSchema.methods.toJSON = function () {
  const user = this
  const { name, email, role, _id } = user.toObject()
  return { name, email, role, _id }
}

export default mongoose.model<IUserDocument, IUserModel>("User", UserSchema)
