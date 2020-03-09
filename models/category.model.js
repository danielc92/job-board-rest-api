const mongoose = require("mongoose")

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("Category", CategorySchema)
