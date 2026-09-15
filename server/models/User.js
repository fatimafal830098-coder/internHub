const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =========================
    // COMMON USER INFORMATION
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    // =========================
    // STUDENT INFORMATION
    // =========================

    education: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    projects: {
      type: [String],
      default: [],
    },

    resume: {
      type: String,
      default: "",
    },

    // =========================
    // RECRUITER INFORMATION
    // =========================

    companyName: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },

    companyLocation: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    companyLogo: {
      type: String,
      default: "",
    },

    // =========================
    // RECRUITER APPROVAL
    // =========================

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);