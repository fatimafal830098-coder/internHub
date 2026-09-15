const Internship = require("../models/Internship");

// Create internship
const createInternship = async (req, res) => {
  try {
    const {
      title,
      companyName,
      description,
      location,
      workMode,
      type,
      stipend,
      skills,
      duration,
      deadline,
    } = req.body;

    if (!title || !companyName || !description || !deadline) {
      return res.status(400).json({
        message:
          "Title, company name, description and deadline are required",
      });
    }

    if (!req.user.isApproved) {
      return res.status(403).json({
        message: "Recruiter is not approved",
      });
    }

    const internship = await Internship.create({
      recruiter: req.user._id,
      title,
      companyName,
      description,
      location,
      workMode,
      type,
      stipend,
      skills,
      duration,
      deadline,
      status: "pending",
    });

    res.status(201).json({
      message: "Internship created successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create internship",
      error: error.message,
    });
  }
};

// Get all approved internships
const getInternships = async (req, res) => {
  try {
    const {
      search,
      location,
      workMode,
      type,
      skill,
    } = req.query;

    const filter = {
      status: "approved",
      deadline: { $gte: new Date() },
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (workMode) {
      filter.workMode = workMode;
    }

    if (type) {
      filter.type = type;
    }

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    const internships = await Internship.find(filter)
      .populate(
        "recruiter",
        "name email companyName"
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

// Get recruiter's own internships
const getRecruiterInternships = async (req, res) => {
  try {
    const internships = await Internship.find({
      recruiter: req.user._id,
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
      message: "Failed to get recruiter internships",
      error: error.message,
    });
  }
};

// Get single internship
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(
      req.params.id
    ).populate(
      "recruiter",
      "name email companyName companyDescription"
    );

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found",
      });
    }

    res.json({
      internship,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get internship",
      error: error.message,
    });
  }
};

// Update internship
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(
      req.params.id
    );

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found",
      });
    }

    if (
      internship.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only update your own internship",
      });
    }

    const {
      title,
      companyName,
      description,
      location,
      workMode,
      type,
      stipend,
      skills,
      duration,
      deadline,
    } = req.body;

    if (title !== undefined) {
      internship.title = title;
    }

    if (companyName !== undefined) {
      internship.companyName = companyName;
    }

    if (description !== undefined) {
      internship.description = description;
    }

    if (location !== undefined) {
      internship.location = location;
    }

    if (workMode !== undefined) {
      internship.workMode = workMode;
    }

    if (type !== undefined) {
      internship.type = type;
    }

    if (stipend !== undefined) {
      internship.stipend = stipend;
    }

    if (skills !== undefined) {
      internship.skills = skills;
    }

    if (duration !== undefined) {
      internship.duration = duration;
    }

    if (deadline !== undefined) {
      internship.deadline = deadline;
    }

    await internship.save();

    res.json({
      message: "Internship updated successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update internship",
      error: error.message,
    });
  }
};

// Delete internship
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(
      req.params.id
    );

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found",
      });
    }

    if (
      internship.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own internship",
      });
    }

    await internship.deleteOne();

    res.json({
      message: "Internship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete internship",
      error: error.message,
    });
  }
};

// Admin: approve internship
const approveInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(
      req.params.id
    );

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found",
      });
    }

    internship.status = "approved";

    await internship.save();

    res.json({
      message: "Internship approved successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve internship",
      error: error.message,
    });
  }
};

module.exports = {
  createInternship,
  getInternships,
  getRecruiterInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  approveInternship,
};