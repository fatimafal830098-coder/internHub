const Notification = require("../models/Notification");
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const applyForInternship = async (req, res) => {
  try {
    const { internshipId, coverLetter } = req.body;

    if (!internshipId) {
      return res.status(400).json({
        message: "Internship ID is required",
      });
    }

    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found",
      });
    }

    if (internship.status !== "approved") {
      return res.status(400).json({
        message: "You can only apply for an approved internship",
      });
    }

    if (new Date(internship.deadline) < new Date()) {
      return res.status(400).json({
        message: "Application deadline has passed",
      });
    }

    const existingApplication = await Application.findOne({
      internship: internshipId,
      student: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this internship",
      });
    }

    const application = await Application.create({
      internship: internshipId,
      student: req.user._id,
      coverLetter: coverLetter || "",
    });

    await Notification.create({
      user: internship.recruiter,
      message: `${req.user.name} applied for your internship`,
      type: "application",
      relatedId: application._id,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

// Student: get my applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user._id,
    })
      .populate(
        "internship",
        "title companyName location workMode type stipend deadline"
      )
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get applications",
      error: error.message,
    });
  }
};

// Recruiter: get applications for own internships
const getRecruiterApplications = async (req, res) => {
  try {
    const internships = await Internship.find({
      recruiter: req.user._id,
    }).select("_id");

    const internshipIds = internships.map(
      (internship) => internship._id
    );

    const applications = await Application.find({
      internship: { $in: internshipIds },
    })
      .populate(
        "student",
        "name email phone bio skills education projects resume profileImage"
      )
      .populate(
        "internship",
        "title companyName location workMode type stipend deadline"
      )
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get recruiter applications",
      error: error.message,
    });
  }
};

// Recruiter: update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewNote } = req.body;

    const allowedStatuses = [
      "under_review",
      "shortlisted",
      "interview",
      "accepted",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const application = await Application.findById(req.params.id)
      .populate("internship")
      .populate("student", "name email");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (
      application.internship.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only manage applications for your internships",
      });
    }

    application.status = status;

    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate || null;
    }

    if (interviewNote !== undefined) {
      application.interviewNote = interviewNote;
    }

    await application.save();

    await Notification.create({
      user: application.student._id,
      message: `Your application status has been changed to ${status}`,
      type: "status",
      relatedId: application._id,
    });

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

module.exports = {
  applyForInternship,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
};