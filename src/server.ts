import express from "express"
import cors from "cors"
import { errorsMiddleware } from "./errors/errorsMiddlewares"
import usersRouter from "./services/user"
import accommodationsRouter from "./services/accommodation"
import googleStrategy from "./auth/oauth/google"
import passport from "passport"
import cookieParser from "cookie-parser"
import { corsOptions } from "./settings/cors"

const server = express()
passport.use("google", googleStrategy)

// MIDDLEWARES
server.use(express.json())
server.use(cors(corsOptions))
server.use(cookieParser())
server.use(passport.initialize())

// ENDPOINTS
server.use("/users", usersRouter)
server.use("/accommodation", accommodationsRouter)

// ERROR MIDDLEWARES
server.use(errorsMiddleware)

export default server
