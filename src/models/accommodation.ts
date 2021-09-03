import mongoose from "mongoose"
import { IAccommodationDocument } from "../typings/accommodation"

const { Schema, model } = mongoose

const reqString = {
  type: String,
  required: true,
}

const accommodationSchema = new Schema<IAccommodationDocument>({
  name: reqString,
  host: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  description: reqString,
  maxGuests: {
    type: Number,
    required: true,
  },
  city: reqString,
})

export default model<IAccommodationDocument>("Accommodation", accommodationSchema)
