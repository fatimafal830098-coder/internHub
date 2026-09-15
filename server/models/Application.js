const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverLetter: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "applied",
        "under_review",
        "shortlisted",
        "interview",
        "accepted",
        "rejected",
      ],
      default: "applied",
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    interviewNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  { internship: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);