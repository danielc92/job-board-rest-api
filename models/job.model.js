const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const employment_types = [
  "full-time",
  "part-time",
  "casual",
  "fixed-term",
  "shift worker",
  "daily/weekly hire",
  "probation",
  "outworkers",
  "other",
]
const JobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    company_name: {
      type: String,
      required: false,
      trim: true,
    },
    benefits: [String],
    skills: [String],
    company_summary: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    job_summary: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    contact_summary: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    requirements: [
      {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    ],
    salary_range_low: {
      type: Number,
      min: 0,
      max: 1000000000,
    },
    salary_range_high: {
      type: Number,
      min: 0,
      max: 1000000000,
    },
    closes: {
      type: Date,
    },
    open: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    location_string: {
      type: String,
    },
    state: {
      type: String,
    },
    employment_type: {
      type: String,
      enum: employment_types,
    },
  },
  {
    timestamps: true,
  }
)

JobSchema.plugin(mongoosePaginate)
JobSchema.index({ title: "text" })
JobSchema.index({ location: "2dsphere" })

module.exports = mongoose.model("Job", JobSchema)
