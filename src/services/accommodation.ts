import express from "express"
import createError from "http-errors"
import { hostsOnly, JWTAuthMiddleware } from "../auth/middlewares"
import AccommodationModel from "../models/accommodation"
import { IUserDocument } from "../typings/users"

const router = express.Router()

// GET /accommodation
router.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const allAccommodation = await AccommodationModel.find()
    res.send(allAccommodation)
  } catch (error) {
    next(createError(500, error as Error))
  }
})
//GET /accommodation/:id
router.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodation = await AccommodationModel.findById(req.params.id)
    if (!accommodation) return next(createError(404, `Accommodation with id ${req.params.id} not found.`))
    res.send(accommodation)
  } catch (error) {
    next(createError(500, error as Error))
  }
})

//// HOST ONLY
//POST /accommodation
router.post("/", JWTAuthMiddleware, hostsOnly, async (req, res, next) => {
  const { name, description, maxGuests, city } = req.body
  const user = req.user as IUserDocument
  try {
    const accommodation = new AccommodationModel({
      name,
      description,
      maxGuests,
      city,
      host: user.id,
    })
    const newAccommodation = await accommodation.save()
    res.status(201).send(newAccommodation)
  } catch (error) {
    next(createError(400, error as Error))
  }
})

// PUT /accommodation/:id
router.put("/:id", JWTAuthMiddleware, hostsOnly, async (req, res, next) => {
  const user = req.user as IUserDocument
  try {
    const accommodation = await AccommodationModel.findOneAndUpdate({ _id: req.params.id, host: user.id }, req.body)
    if (!accommodation) return next(createError(404, "Accommodation not found"))
    res.json(accommodation)
  } catch (error) {
    next(createError(400, error as Error))
  }
})

// DELETE /accommodation/:id

router.delete("/:id", JWTAuthMiddleware, hostsOnly, async (req, res, next) => {
  const user = req.user as IUserDocument
  try {
    const accommodation = await AccommodationModel.findOneAndDelete({ _id: req.params.id, host: user.id })
    if (!accommodation) return next(createError(404, "Accommodation not found"))
    res.json({ message: "Deleted" })
  } catch (error) {
    next(createError(500, error as Error))
  }
})

export default router
