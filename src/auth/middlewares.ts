import createError from "http-errors"
import UserModel from "../models/user"
import { verifyJWT } from "./tools"
import { Request, Response, NextFunction } from "express"
import { JwtPayload } from "jsonwebtoken"
import { IUserDocument } from "../typings/users"

export const JWTAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.accessToken) return next(createError(401, "Please provide credentials in cookies."))

  const token = req.cookies.accessToken
  try {
    const decodedToken = (await verifyJWT(token)) as JwtPayload
    const user = await UserModel.findById(decodedToken._id)
    if (!user) return next(createError(404, "User not found."))
    req.user = user
    next()
  } catch (error) {
    next(createError(401, "Invalid token"))
  }
}

export const hostsOnly = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument
  if (user.role === "host") next()
  else next(createError(403, "Access to hosts only"))
}
