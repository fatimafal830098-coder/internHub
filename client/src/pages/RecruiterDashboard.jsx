import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "../api";
import InternshipForm from "../components/InternshipForm";
import ApplicationCard from "../components/ApplicationCard";

function RecruiterDashboard() {
  const user = useSelector(
    (state) => state.auth.user
  );

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const internshipResponse = await api.get(
          "/internships/recruiter"
        );

        const applicationResponse = await api.get(
          "/applications/recruiter"
        );

        setInternships(
          internshipResponse.data.internships || []
        );

        setApplications(
          applicationResponse.data.applications || []
        );
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load recruiter data"
        );
      }
    };

    if (user?.role === "recruiter") {
      fetchRecruiterData();
    }
  }, [user]);

  const handleCreateInternship = async (data) => {
    try {
      const response = await api.post(
        "/internships",
        data
      );

      setInternships([
        response.data.internship,
        ...internships,
      ]);

      setShowForm(false);

      setMessage(
        "Internship created successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create internship"
      );
    }
  };

  if (!user) {
    return <p>Please login first.</p>;
  }

  if (user.role !== "recruiter") {
    return (
      <p>
        Only recruiters can access this dashboard.
      </p>
    );
  }

  return (
    <div className="recruiter-dashboard">
      <h1>Recruiter Dashboard</h1>

      <p>
        Welcome, {user.name}
      </p>

      {message && <p>{message}</p>}

      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm
          ? "Cancel"
          : "Post Internship"}
      </button>

      {showForm && (
        <InternshipForm
          onSubmit={handleCreateInternship}
        />
      )}

      <section>
        <h2>My Internships</h2>

        {internships.length === 0 ? (
          <p>No internships found.</p>
        ) : (
          internships.map((internship) => (
            <div
              key={internship._id}
              className="dashboard-internship"
            >
              <h3>{internship.title}</h3>

              <p>
                Company: {internship.companyName}
              </p>

              <p>
                Status: {internship.status}
              </p>

              <p>
                Deadline:{" "}
                {new Date(
                  internship.deadline
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Applications</h2>

        {applications.length === 0 ? (
          <p>No applications received.</p>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default RecruiterDashboard;