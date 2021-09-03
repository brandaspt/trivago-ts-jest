import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import UserModel from "../../models/user"
import { getTokens } from "../tools"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID!,
    clientSecret: process.env.GOOGLE_APP_SECRET!,
    callbackURL: "http://localhost:3001/users/googleRedirect",
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      const user = await UserModel.findOne({ googleId: profile.id })
      if (user) {
        const tokens = await getTokens(user)
        passportNext(null, { tokens })
      } else {
        const newUserData = new UserModel({
          name: profile.name!.givenName,
          email: profile.emails![0].value,
          role: "guest",
          googleId: profile.id,
        })
        const newUser = await newUserData.save()
        const tokens = await getTokens(newUser)
        passportNext(null, { user: newUser, tokens })
      }
    } catch (error) {
      passportNext(error as Error)
    }
  }
)

passport.serializeUser(function (user, passportNext) {
  // REQUIRED to have req.user
  passportNext(null, user)
})

export default googleStrategy
