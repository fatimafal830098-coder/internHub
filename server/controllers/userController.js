const User = require("../models/User");

// Get current user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// Update current user's profile
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      bio,
      skills,
      education,
      projects,
      companyName,
      companyDescription,
      companyLocation,
      website,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =========================
    // COMMON INFORMATION
    // =========================

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    // =========================
    // STUDENT INFORMATION
    // =========================

    if (skills !== undefined) {
      user.skills = skills;
    }

    if (education !== undefined) {
      user.education = education;
    }

    if (projects !== undefined) {
      user.projects = projects;
    }

    // =========================
    // RECRUITER INFORMATION
    // =========================

    if (user.role === "recruiter") {
      if (companyName !== undefined) {
        user.companyName = companyName;
      }

      if (companyDescription !== undefined) {
        user.companyDescription = companyDescription;
      }

      if (companyLocation !== undefined) {
        user.companyLocation = companyLocation;
      }

      if (website !== undefined) {
        user.website = website;
      }
    }

    // =========================
    // PROFILE IMAGE
    // =========================

    if (req.files?.profileImage) {
      user.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }

    // =========================
    // STUDENT RESUME
    // =========================

    if (req.files?.resume) {
      user.resume = `/uploads/${req.files.resume[0].filename}`;
    }

    // =========================
    // RECRUITER COMPANY LOGO
    // =========================

    if (req.files?.companyLogo) {
      user.companyLogo = `/uploads/${req.files.companyLogo[0].filename}`;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        profileImage: user.profileImage,

        phone: user.phone,
        bio: user.bio,

        // Student information
        skills: user.skills,
        education: user.education,
        projects: user.projects,
        resume: user.resume,

        // Recruiter information
        companyName: user.companyName,
        companyDescription: user.companyDescription,
        companyLocation: user.companyLocation,
        website: user.website,
        companyLogo: user.companyLogo,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Admin: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
};

// Admin: approve or reject recruiter
const updateRecruiterApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "recruiter") {
      return res.status(400).json({
        message: "Only recruiters can be approved",
      });
    }

    user.isApproved = Boolean(isApproved);

    await user.save();

    res.json({
      message: user.isApproved
        ? "Recruiter approved successfully"
        : "Recruiter approval removed",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update recruiter approval",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  updateRecruiterApproval,
};