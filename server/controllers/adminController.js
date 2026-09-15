const User = require("../models/User");
const Internship = require("../models/Internship");
const Application = require("../models/Application");

// Admin: get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    const approvedRecruiters =
      await User.countDocuments({
        role: "recruiter",
        isApproved: true,
      });

    const pendingRecruiters =
      await User.countDocuments({
        role: "recruiter",
        isApproved: false,
      });

    const totalInternships =
      await Internship.countDocuments();

    const pendingInternships =
      await Internship.countDocuments({
        status: "pending",
      });

    const approvedInternships =
      await Internship.countDocuments({
        status: "approved",
      });

    const rejectedInternships =
      await Internship.countDocuments({
        status: "rejected",
      });

    const totalApplications =
      await Application.countDocuments();

    const acceptedApplications =
      await Application.countDocuments({
        status: "accepted",
      });

    const shortlistedApplications =
      await Application.countDocuments({
        status: "shortlisted",
      });

    const interviewApplications =
      await Application.countDocuments({
        status: "interview",
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "rejected",
      });

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        approvedRecruiters,
        pendingRecruiters,
        totalInternships,
        pendingInternships,
        approvedInternships,
        rejectedInternships,
        totalApplications,
        acceptedApplications,
        shortlistedApplications,
        interviewApplications,
        rejectedApplications,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to get dashboard statistics",
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

    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
};

// Admin: get students
const getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      students,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get students",
      error: error.message,
    });
  }
};

// Admin: get recruiters
const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      recruiters,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get recruiters",
      error: error.message,
    });
  }
};

// Admin: get all internships
const getAllInternships = async (req, res) => {
  try {
    const internships =
      await Internship.find()
        .populate(
          "recruiter",
          "name email companyName companyDescription"
        )
        .sort({ createdAt: -1 });

    res.json({
      internships,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get internships",
      error: error.message,
    });
  }
};

// Admin: get pending internships
const getPendingInternships = async (
  req,
  res
) => {
  try {
    const internships =
      await Internship.find({
        status: "pending",
      })
        .populate(
          "recruiter",
          "name email companyName companyDescription"
        )
        .sort({ createdAt: -1 });

    res.json({
      internships,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to get pending internships",
      error: error.message,
    });
  }
};

// Admin: get all applications
const getAllApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "student",
          "name email profileImage"
        )
        .populate(
          "internship",
          "title companyName recruiter deadline status"
        )
        .sort({ createdAt: -1 });

    res.json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get applications",
      error: error.message,
    });
  }
};

// Admin: delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Never allow an admin account
    // to be deleted.
    if (user.role === "admin") {
      return res.status(400).json({
        message:
          "Admin user cannot be deleted",
      });
    }

    // Remove applications submitted
    // by this student.
    await Application.deleteMany({
      student: user._id,
    });

    // Remove internships created
    // by this recruiter.
    const recruiterInternships =
      await Internship.find({
        recruiter: user._id,
      }).select("_id");

    const internshipIds =
      recruiterInternships.map(
        (item) => item._id
      );

    if (internshipIds.length > 0) {
      await Application.deleteMany({
        internship: {
          $in: internshipIds,
        },
      });
    }

    await Internship.deleteMany({
      recruiter: user._id,
    });

    await user.deleteOne();

    res.json({
      message:
        "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to delete user",
      error: error.message,
    });
  }
};

// Admin: reject internship
const rejectInternship = async (
  req,
  res
) => {
  try {
    const internship =
      await Internship.findById(
        req.params.id
      );

    if (!internship) {
      return res.status(404).json({
        message:
          "Internship not found",
      });
    }

    internship.status = "rejected";

    await internship.save();

    res.json({
      message:
        "Internship rejected successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to reject internship",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getStudents,
  getRecruiters,
  getAllInternships,
  getPendingInternships,
  getAllApplications,
  deleteUser,
  rejectInternship,
};