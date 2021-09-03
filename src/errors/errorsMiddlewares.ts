import { HttpError } from "http-errors"
import { Request, Response, NextFunction } from "express"

export const errorsMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const errStatus = [400, 401, 403, 404]
  if (!errStatus.includes(err.status)) {
    console.log(err)
    res.status(500).json("Generic Server Error")
  } else {
    res.status(err.status).json(err)
  }
}
