import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "../api";
import {
  setUser,
  setError,
  setLoading,
} from "../redux/authSlice";

function Profile() {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",

    // Student
    education: "",
    skills: "",
    projects: "",

    // Recruiter
    companyName: "",
    companyDescription: "",
    companyLocation: "",
    website: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const [preview, setPreview] = useState("");
  const [companyLogoPreview, setCompanyLogoPreview] =
    useState("");

  // =========================
  // FILE URL
  // =========================

  const getFileUrl = (filePath) => {
    if (!filePath) return "";

    const serverUrl = api.defaults.baseURL.replace(
      /\/api\/?$/,
      ""
    );

    return `${serverUrl}${filePath}`;
  };

  // =========================
  // LOAD USER DATA
  // =========================

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",

      education: user.education || "",

      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : "",

      projects: Array.isArray(user.projects)
        ? user.projects.join(", ")
        : "",

      companyName: user.companyName || "",
      companyDescription:
        user.companyDescription || "",
      companyLocation: user.companyLocation || "",
      website: user.website || "",
    });

    setPreview(
      user.profileImage
        ? getFileUrl(user.profileImage)
        : ""
    );

    setCompanyLogoPreview(
      user.companyLogo
        ? getFileUrl(user.companyLogo)
        : ""
    );
  }, [user]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // PROFILE IMAGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // =========================
  // RESUME
  // =========================

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setResume(file);
    }
  };

  // =========================
  // COMPANY LOGO
  // =========================

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setCompanyLogo(file);

      setCompanyLogoPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = new FormData();

      // =========================
      // PERSONAL INFORMATION
      // =========================

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);

      // =========================
      // STUDENT INFORMATION
      // =========================

      if (user.role === "student") {
        data.append(
          "education",
          formData.education
        );

        const skills = formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

        data.append(
          "skills",
          JSON.stringify(skills)
        );

        const projects = formData.projects
          .split(",")
          .map((project) => project.trim())
          .filter(Boolean);

        data.append(
          "projects",
          JSON.stringify(projects)
        );
      }

      // =========================
      // RECRUITER INFORMATION
      // =========================

      if (user.role === "recruiter") {
        data.append(
          "companyName",
          formData.companyName
        );

        data.append(
          "companyLocation",
          formData.companyLocation
        );

        data.append(
          "website",
          formData.website
        );

        data.append(
          "companyDescription",
          formData.companyDescription
        );
      }

      // =========================
      // PROFILE IMAGE
      // =========================

      if (profileImage) {
        data.append(
          "profileImage",
          profileImage
        );
      }

      // =========================
      // STUDENT RESUME
      // =========================

      if (
        user.role === "student" &&
        resume
      ) {
        data.append("resume", resume);
      }

      // =========================
      // RECRUITER COMPANY LOGO
      // =========================

      if (
        user.role === "recruiter" &&
        companyLogo
      ) {
        data.append(
          "companyLogo",
          companyLogo
        );
      }

      // =========================
      // API REQUEST
      // =========================

      const response = await api.put(
        "/users/profile",
        data
      );

      // Update Redux user
      dispatch(
        setUser(response.data.user)
      );

      // Update profile image
      if (
        response.data.user.profileImage
      ) {
        setPreview(
          getFileUrl(
            response.data.user.profileImage
          )
        );
      }

      // Update company logo
      if (
        response.data.user.companyLogo
      ) {
        setCompanyLogoPreview(
          getFileUrl(
            response.data.user.companyLogo
          )
        );
      }

      // Clear selected files
      setProfileImage(null);
      setResume(null);
      setCompanyLogo(null);

    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to update profile"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // =========================
  // LOGIN CHECK
  // =========================

  if (!user) {
    return (
      <div className="profile-login-message">
        Please login first.
      </div>
    );
  }

  // =========================
  // ROLE
  // =========================

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "recruiter"
      ? "Recruiter"
      : "Student";

  const isStudent = user.role === "student";
  const isRecruiter = user.role === "recruiter";

  // =========================
  // UI
  // =========================

  return (
    <div className="profile-page">

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >

        {/* =====================================
            PROFILE HEADER
        ===================================== */}

        <div className="profile-top">

          <div className="profile-photo-area">

            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="profile-main-image"
              />
            ) : (
              <div className="profile-main-placeholder">
                {user.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>
            )}

            <label className="profile-photo-button">
              Change Photo

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

          </div>

          <div className="profile-user-info">

            <h1>{user.name}</h1>

            <p>{roleLabel}</p>

          </div>

        </div>

        {/* =====================================
            PERSONAL INFORMATION
        ===================================== */}

        <section className="profile-card">

          <div className="profile-card-heading">
            <h2>Personal Information</h2>
          </div>

          <div className="profile-grid">

            {/* FULL NAME */}

            <div className="profile-input-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* EMAIL */}

            <div className="profile-input-group">

              <label>Email</label>

              <input
                type="email"
                value={user.email || ""}
                disabled
              />

            </div>

            {/* PHONE */}

            <div className="profile-input-group">

              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

            </div>

            {/* BIO */}

            <div className="profile-input-group full-width">

              <label>Bio</label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short bio..."
                rows="4"
              />

            </div>

          </div>

        </section>

        {/* =====================================
            STUDENT INFORMATION
        ===================================== */}

        {isStudent && (
          <>
            <section className="profile-card">

              <div className="profile-card-heading">
                <h2>Academic Information</h2>
              </div>

              <div className="profile-grid">

                <div className="profile-input-group full-width">

                  <label>Education</label>

                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g. BS Artificial Intelligence"
                  />

                </div>

                <div className="profile-input-group full-width">

                  <label>Skills</label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, MongoDB..."
                  />

                </div>

                <div className="profile-input-group full-width">

                  <label>Projects</label>

                  <input
                    type="text"
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    placeholder="InternHub, Gallery, Chat App..."
                  />

                </div>

              </div>

            </section>

            {/* RESUME */}

            <section className="profile-card">

              <div className="profile-card-heading">
                <h2>Resume</h2>
              </div>

              <div className="profile-file-box">

                <div className="file-information">

                  <strong>
                    {resume
                      ? resume.name
                      : user.resume
                      ? "Current resume uploaded"
                      : "No resume uploaded"}
                  </strong>

                  <span>
                    PDF, DOC or DOCX
                  </span>

                </div>

                <label className="file-upload-button">

                  {user.resume
                    ? "Replace Resume"
                    : "Upload Resume"}

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                  />

                </label>

              </div>

              {user.resume && (
                <a
                  href={getFileUrl(user.resume)}
                  target="_blank"
                  rel="noreferrer"
                  className="view-resume"
                >
                  View Current Resume →
                </a>
              )}

            </section>
          </>
        )}

        {/* =====================================
            RECRUITER COMPANY INFORMATION
        ===================================== */}

        {isRecruiter && (
          <>
            <section className="profile-card">

              <div className="profile-card-heading">
                <h2>Company Information</h2>
              </div>

              <div className="profile-grid">

                {/* COMPANY NAME */}

                <div className="profile-input-group">

                  <label>Company Name</label>

                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />

                </div>

                {/* COMPANY LOCATION */}

                <div className="profile-input-group">

                  <label>Company Location</label>

                  <input
                    type="text"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />

                </div>

                {/* WEBSITE */}

                <div className="profile-input-group full-width">

                  <label>Company Website</label>

                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="profile-input-group full-width">

                  <label>Company Description</label>

                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    placeholder="Write a short description about your company..."
                    rows="5"
                  />

                </div>

              </div>

            </section>

            {/* =====================================
                COMPANY LOGO
            ===================================== */}

            <section className="profile-card">

              <div className="profile-card-heading">
                <h2>Company Logo</h2>
              </div>

              <div className="company-logo-section">

                <div className="company-logo-preview-box">

                  {companyLogoPreview ? (
                    <img
                      src={companyLogoPreview}
                      alt="Company Logo"
                      className="company-logo-image"
                    />
                  ) : (
                    <div className="company-logo-placeholder">
                      {formData.companyName
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>
                  )}

                </div>

                <label className="file-upload-button">

                  {companyLogoPreview
                    ? "Change Logo"
                    : "Upload Logo"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleCompanyLogoChange
                    }
                  />

                </label>

              </div>

            </section>
          </>
        )}

        {/* =====================================
            SAVE CHANGES
        ===================================== */}

        <div className="profile-save">

          <button
            type="submit"
            disabled={loading}
            className="profile-save-button"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

      </form>

    </div>
  );
}

export default Profile;