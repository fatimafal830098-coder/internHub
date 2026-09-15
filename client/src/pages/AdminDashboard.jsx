import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "../api";

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  const [activeSection, setActiveSection] = useState("users");
  const [selectedInternship, setSelectedInternship] =
    useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // FILE URL
  // =========================

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    const serverUrl = api.defaults.baseURL.replace(
      /\/api\/?$/,
      ""
    );

    return `${serverUrl}${filePath}`;
  };

  // =========================
  // FETCH ADMIN DATA
  // =========================

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setMessage("");

        const [
          statsResponse,
          usersResponse,
          internshipsResponse,
          applicationsResponse,
        ] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/users"),
          api.get("/admin/internships"),
          api.get("/admin/applications"),
        ]);

        setStats(statsResponse.data.stats);

        setUsers(
          usersResponse.data.users || []
        );

        setInternships(
          internshipsResponse.data.internships || []
        );

        setApplications(
          applicationsResponse.data.applications || []
        );
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load admin data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  // =========================
  // DELETE USER
  // =========================

  const handleDeleteUser = async (id) => {
    const selectedUser = users.find(
      (item) => item._id === id
    );

    if (!selectedUser) {
      return;
    }

    if (selectedUser.role === "admin") {
      setMessage(
        "Admin accounts cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedUser.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);

      setUsers((previous) =>
        previous.filter(
          (item) => item._id !== id
        )
      );

      setMessage(
        "User deleted successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  // =========================
  // RECRUITER APPROVAL
  // =========================

  const handleRecruiterApproval = async (
    id,
    isApproved
  ) => {
    try {
      const response = await api.patch(
        `/users/recruiters/${id}/approval`,
        {
          isApproved,
        }
      );

      setUsers((previous) =>
        previous.map((item) =>
          item._id === id
            ? {
                ...item,
                isApproved:
                  response.data.user
                    ?.isApproved ??
                  isApproved,
              }
            : item
        )
      );

      setMessage(
        isApproved
          ? "Recruiter approved successfully."
          : "Recruiter rejected successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update recruiter approval"
      );
    }
  };

  // =========================
  // APPROVE INTERNSHIP
  // =========================

  const handleApproveInternship = async (
    id
  ) => {
    try {
      const response = await api.patch(
        `/internships/${id}/approve`
      );

      const updatedInternship =
        response.data.internship;

      setInternships((previous) =>
        previous.map((item) =>
          item._id === id
            ? updatedInternship
            : item
        )
      );

      setSelectedInternship(null);

      setMessage(
        "Internship approved successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to approve internship"
      );
    }
  };

  // =========================
  // REJECT INTERNSHIP
  // =========================

  const handleRejectInternship = async (
    id
  ) => {
    try {
      const response = await api.patch(
        `/admin/internships/${id}/reject`
      );

      const updatedInternship =
        response.data.internship;

      setInternships((previous) =>
        previous.map((item) =>
          item._id === id
            ? updatedInternship
            : item
        )
      );

      setSelectedInternship(null);

      setMessage(
        "Internship rejected successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to reject internship"
      );
    }
  };

  // =========================
  // DISPLAY USERS
  // =========================

  const getDisplayedUsers = () => {
    let result = [...users];

    if (activeSection === "students") {
      result = result.filter(
        (item) => item.role === "student"
      );
    }

    if (activeSection === "recruiters") {
      result = result.filter(
        (item) => item.role === "recruiter"
      );
    }

    if (search.trim()) {
      const searchValue =
        search.trim().toLowerCase();

      result = result.filter((item) => {
        const name =
          item.name?.toLowerCase() || "";

        const email =
          item.email?.toLowerCase() || "";

        const phone =
          item.phone?.toLowerCase() || "";

        const company =
          item.companyName?.toLowerCase() || "";

        return (
          name.includes(searchValue) ||
          email.includes(searchValue) ||
          phone.includes(searchValue) ||
          company.includes(searchValue)
        );
      });
    }

    if (
      roleFilter !== "all" &&
      activeSection === "users"
    ) {
      result = result.filter(
        (item) => item.role === roleFilter
      );
    }

    return result;
  };

  const displayedUsers = getDisplayedUsers();

  // =========================
  // PENDING INTERNSHIPS
  // =========================

  const pendingInternships =
    internships.filter(
      (item) => item.status === "pending"
    );

  // =========================
  // STATUS FORMAT
  // =========================

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =========================
  // ACCESS CHECK
  // =========================

  if (!user) {
    return <p>Please login first.</p>;
  }

  if (user.role !== "admin") {
    return (
      <p>
        Only admins can access this dashboard.
      </p>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Welcome, {user.name}
          </p>
        </div>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      {loading && (
        <p>Loading admin data...</p>
      )}

      {/* =========================
          STAT CARDS
      ========================= */}

      {stats && (
        <div className="admin-stats">
          <button
            type="button"
            className="stat-card"
            onClick={() =>
              setActiveSection("users")
            }
          >
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </button>

          <button
            type="button"
            className="stat-card"
            onClick={() =>
              setActiveSection("students")
            }
          >
            <h3>Students</h3>
            <p>{stats.totalStudents}</p>
          </button>

          <button
            type="button"
            className="stat-card"
            onClick={() =>
              setActiveSection("recruiters")
            }
          >
            <h3>Recruiters</h3>
            <p>{stats.totalRecruiters}</p>
          </button>

          <button
            type="button"
            className="stat-card"
            onClick={() =>
              setActiveSection("internships")
            }
          >
            <h3>Internships</h3>
            <p>{stats.totalInternships}</p>
          </button>

          <button
            type="button"
            className="stat-card"
            onClick={() =>
              setActiveSection("applications")
            }
          >
            <h3>Applications</h3>
            <p>{stats.totalApplications}</p>
          </button>
        </div>
      )}

      {/* =========================
          USERS
      ========================= */}

      {(activeSection === "users" ||
        activeSection === "students" ||
        activeSection === "recruiters") && (
        <section className="admin-section">
          <div className="users-section-header">
            <div>
              <h2>
                {activeSection === "students"
                  ? "Students"
                  : activeSection === "recruiters"
                  ? "Recruiters"
                  : "Manage Users"}
              </h2>

              <p>
                View and manage registered users.
              </p>
            </div>

            <span className="user-count">
              {displayedUsers.length} users
            </span>
          </div>

          {/* SEARCH + FILTER */}

          <div className="user-filters">
            <input
              type="text"
              placeholder="Search by name, email or company..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {activeSection === "users" && (
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >
                <option value="all">
                  All Roles
                </option>

                <option value="student">
                  Students
                </option>

                <option value="recruiter">
                  Recruiters
                </option>

                <option value="admin">
                  Admins
                </option>
              </select>
            )}
          </div>

          {displayedUsers.length === 0 ? (
            <div className="admin-empty">
              <h3>No users found</h3>
              <p>
                No users match your current
                search or filter.
              </p>
            </div>
          ) : (
            <div className="user-grid">
              {displayedUsers.map((item) => (
                <div
                  key={item._id}
                  className="user-card"
                >
                  {/* PROFILE */}

                  <div className="user-card-top">
                    {item.profileImage ? (
                      <img
                        src={getFileUrl(
                          item.profileImage
                        )}
                        alt={item.name}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {item.name
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <h3>{item.name}</h3>

                      <span
                        className={`user-role role-${item.role}`}
                      >
                        {item.role}
                      </span>
                    </div>
                  </div>

                  {/* CONTACT */}

                  <div className="user-details">
                    <p>
                      <strong>Email</strong>
                      <span>
                        {item.email ||
                          "Not provided"}
                      </span>
                    </p>

                    <p>
                      <strong>Phone</strong>
                      <span>
                        {item.phone ||
                          "Not provided"}
                      </span>
                    </p>
                  </div>

                  {/* STUDENT INFORMATION */}

                  {item.role === "student" && (
                    <div className="user-extra-info">
                      {item.education && (
                        <p>
                          <strong>
                            Education
                          </strong>
                          <span>
                            {item.education}
                          </span>
                        </p>
                      )}

                      {Array.isArray(
                        item.skills
                      ) &&
                        item.skills.length > 0 && (
                          <div className="user-skills">
                            {item.skills
                              .slice(0, 5)
                              .map(
                                (
                                  skill,
                                  index
                                ) => (
                                  <span
                                    key={`${skill}-${index}`}
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                          </div>
                        )}
                    </div>
                  )}

                  {/* RECRUITER INFORMATION */}

                  {item.role === "recruiter" && (
                    <div className="user-extra-info">
                      <p>
                        <strong>
                          Company
                        </strong>
                        <span>
                          {item.companyName ||
                            "Not provided"}
                        </span>
                      </p>

                      <p>
                        <strong>
                          Approval
                        </strong>

                        <span
                          className={
                            item.isApproved
                              ? "approval-approved"
                              : "approval-pending"
                          }
                        >
                          {item.isApproved
                            ? "Approved"
                            : "Pending"}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* ADMIN */}

                  {item.role === "admin" && (
                    <div className="user-extra-info">
                      <p>
                        <strong>
                          Account
                        </strong>
                        <span>
                          Protected Admin
                        </span>
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}

                  <div className="user-card-actions">
                    {item.role ===
                      "recruiter" && (
                      <>
                        {!item.isApproved && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRecruiterApproval(
                                item._id,
                                true
                              )
                            }
                          >
                            Approve Recruiter
                          </button>
                        )}

                        {item.isApproved && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRecruiterApproval(
                                item._id,
                                false
                              )
                            }
                          >
                            Reject Recruiter
                          </button>
                        )}
                      </>
                    )}

                    {item.role !== "admin" && (
                      <button
                        type="button"
                        className="delete-user-button"
                        onClick={() =>
                          handleDeleteUser(
                            item._id
                          )
                        }
                      >
                        Delete User
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =========================
          INTERNSHIPS
      ========================= */}

      {activeSection === "internships" && (
        <section className="admin-section">
          <h2>Internship Management</h2>

          <h3>
            Pending Internship Approval
          </h3>

          {pendingInternships.length === 0 ? (
            <p>No pending internships.</p>
          ) : (
            pendingInternships.map(
              (internship) => (
                <div
                  key={internship._id}
                  className="internship-admin-card"
                >
                  <h3>
                    {internship.title}
                  </h3>

                  <p>
                    Company:{" "}
                    {internship.companyName}
                  </p>

                  <p>
                    Recruiter:{" "}
                    {internship.recruiter
                      ?.name ||
                      "Unknown"}
                  </p>

                  <p>
                    Status:{" "}
                    {formatStatus(
                      internship.status
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedInternship(
                        internship
                      )
                    }
                  >
                    Internship Details
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApproveInternship(
                        internship._id
                      )
                    }
                  >
                    Approve Internship
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleRejectInternship(
                        internship._id
                      )
                    }
                  >
                    Reject Internship
                    </button>
                    </div>
              )
            )
          )}
          {/* =========================
                      INTERNSHIP DETAILS
                  ========================= */}

                  {selectedInternship && (
                    <div className="internship-details">

                      <h2>
                        Internship Details
                      </h2>

                      <h3>
                        {selectedInternship.title}
                      </h3>

                      <p>
                        <strong>
                          Company:
                        </strong>{" "}
                        {selectedInternship.companyName}
                      </p>

                      <p>
                        <strong>
                          Recruiter:
                        </strong>{" "}
                        {selectedInternship.recruiter
                          ?.name ||
                          "Unknown"}
                      </p>

                      <p>
                        <strong>
                          Recruiter Email:
                        </strong>{" "}
                        {selectedInternship.recruiter
                          ?.email ||
                          "Unknown"}
                      </p>

                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {selectedInternship.location}
                      </p>

                      <p>
                        <strong>
                          Work Mode:
                        </strong>{" "}
                        {selectedInternship.workMode}
                      </p>

                      <p>
                        <strong>
                          Type:
                        </strong>{" "}
                        {selectedInternship.type}
                      </p>

                      <p>
                        <strong>
                          Stipend:
                        </strong>{" "}
                        {selectedInternship.stipend}
                      </p>

                      <p>
                        <strong>
                          Duration:
                        </strong>{" "}
                        {selectedInternship.duration ||
                          "Not specified"}
                      </p>

                      <p>
                        <strong>
                          Skills:
                        </strong>{" "}
                        {selectedInternship.skills?.join(
                          ", "
                        ) ||
                          "No skills specified"}
                      </p>

                      <p>
                        <strong>
                          Deadline:
                        </strong>{" "}
                        {new Date(
                          selectedInternship.deadline
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {formatStatus(
                          selectedInternship.status
                        )}
                      </p>

                      <p>
                        <strong>
                          Description:
                        </strong>
                      </p>

                      <p>
                        {selectedInternship.description}
                      </p>

                      {selectedInternship.status ===
                        "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleApproveInternship(
                                selectedInternship._id
                              )
                            }
                          >
                            Approve Internship
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRejectInternship(
                                selectedInternship._id
                              )
                            }
                          >
                            Reject Internship
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedInternship(null)
                        }
                      >
                        Close Details
                      </button>

                    </div>
                  )}

                </section>
              )}

              {/* =========================
                  APPLICATIONS
              ========================= */}

              {activeSection === "applications" && (
                <section className="admin-section">

                  <h2>
                    All Applications
                  </h2>

                  {applications.length === 0 ? (
                    <p>
                      No applications found.
                    </p>
                  ) : (
                    applications.map(
                      (application) => (
                        <div
                          key={application._id}
                          className="application-admin-card"
                        >

                          <h3>
                            {application
                              .internship
                              ?.title ||
                              "Internship"}
                          </h3>

                          <p>
                            <strong>
                              Student:
                            </strong>{" "}
                            {application.student
                              ?.name ||
                              "Unknown"}
                          </p>

                          <p>
                            <strong>
                              Email:
                            </strong>{" "}
                            {application.student
                              ?.email ||
                              "Unknown"}
                          </p>

                          <p>
                            <strong>
                              Company:
                            </strong>{" "}
                            {application
                              .internship
                              ?.companyName ||
                              "Unknown"}
                          </p>

                          <p>
                            <strong>
                              Status:
                            </strong>{" "}
                            <span>
                              {formatStatus(
                                application.status
                              )}
                            </span>
                          </p>

                          <p>
                            <strong>
                              Applied:
                            </strong>{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </p>

                        </div>
                      )
                    )
                  )}

                </section>
              )}

            </div>
          );
        }

        export default AdminDashboard;