const mongoose = require("mongoose")

const DocumentationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    route: {
      type: String,
      required: true
    },
    content: {
      type: [Object],
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Documentation = mongoose.model("Documentation", DocumentationSchema)

module.exports = Documentation
