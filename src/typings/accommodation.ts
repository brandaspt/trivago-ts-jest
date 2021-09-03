import { Document, Model } from "mongoose"
import mongoose from "mongoose"

export interface IAccommodation {
  name: string
  host: mongoose.Schema.Types.ObjectId
  description: string
  maxGuests: number
  city: string
}

export interface IAccommodationDocument extends Document, IAccommodation {}
