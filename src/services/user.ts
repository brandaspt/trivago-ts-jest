import express from "express"
import UserModel from "../models/user"
import AccommodationModel from "../models/accommodation"
import { IUserDocument } from "../typings/users"
import { JWTAuthMiddleware, hostsOnly } from "../auth/middlewares"
import { getTokens, refreshTokens } from "../auth/tools"
import createError from "http-errors"
import passport from "passport"

const UsersRouter = express.Router()

UsersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const savedUser = await newUser.save()
    const { accessToken, refreshToken } = await getTokens(savedUser)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "none",
    })
    res.cookie("refreshToken", refreshToken, { httpOnly: true })
    res.status(201).send({ accessToken, refreshToken, user: savedUser })
  } catch (error) {
    next(createError(400, error as Error))
  }
})

UsersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)
    if (user) {
      const { accessToken, refreshToken } = await getTokens(user)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "none",
      })
      res.cookie("refreshToken", refreshToken, { httpOnly: true })
      res.status(204).send()
    } else {
      next(createError(401, "Invalid Credentials"))
    }
  } catch (error) {
    next(createError(500, error as Error))
  }
})

UsersRouter.post("/refreshTokens", async (req, res, next) => {
  const currentRefreshToken = req.body.refreshToken
  if (!currentRefreshToken) return next(createError(404, "Refresh Token must be provided in body: {refreshToken: <token>}"))
  try {
    const tokens = await refreshTokens(currentRefreshToken)
    if (!tokens) return next(createError(401, "Invalid token"))
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "none",
    })
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true })
    res.status(204).send()
  } catch (error) {
    next(createError(500, error as Error))
  }
})

UsersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(createError(500, error as Error))
  }
})

UsersRouter.get("/me/accommodation", JWTAuthMiddleware, hostsOnly, async (req, res, next) => {
  const user = req.user as IUserDocument
  try {
    const accommodations = await AccommodationModel.find({
      host: user._id,
    }).populate("host", { role: 0 })
    res.send(accommodations)
  } catch (error) {
    next(createError(500, error as Error))
  }
})

UsersRouter.get("/googleLogin", passport.authenticate("google", { scope: ["email", "profile"] }))

UsersRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
  const user: any = req.user
  try {
    res.cookie("accessToken", user.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "none",
    })
    res.cookie("refreshToken", user.tokens.refreshToken, { httpOnly: true })
    res.redirect(`http://localhost:3001/users/me`)
  } catch (error) {
    next(error)
  }
})

export default UsersRouter
