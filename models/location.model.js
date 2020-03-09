const mongoose = require("mongoose")

const LocationSchema = mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    state: String,
    location_string: String,
    postcode: Number,
    locality: String
  },
  {
    timestamps: true
  }
)

//Text index for full text search.
LocationSchema.index({ location_string: "text" })

const Location = mongoose.model("Location", LocationSchema)

module.exports = Location
