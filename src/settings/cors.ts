import cors, { CorsOptions } from "cors"

const whitelist = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_PROD_URL]

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by cors"))
    }
  },
  credentials: true,
}
