const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const JobApplicationSchema = mongoose.Schema(
  {
    applicant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    status: {
      type: String,
      default: "pending",
      trim: true,
      lowercase: true,
      enum: ["pending", "rejected", "interested", "withdrawn"]
    },
    user_message: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

JobApplicationSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("JobApplication", JobApplicationSchema)
