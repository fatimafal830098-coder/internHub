const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "Remote",
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "Remote",
    },

    type: {
      type: String,
      enum: ["Full-time", "Part-time"],
      default: "Part-time",
    },

    stipend: {
      type: String,
      default: "Unpaid",
    },

    skills: {
      type: [String],
      default: [],
    },

    duration: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Internship", internshipSchema);