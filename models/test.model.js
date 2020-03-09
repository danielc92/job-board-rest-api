const mongoose = require("mongoose")

const ThingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: Number,
    required: true
  }
})

const TestSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    country: {
      type: String
    },
    things: [ThingSchema]
  },
  {
    timestamps: true
  }
)

const Test = mongoose.model("Test", TestSchema)

module.exports = Test
