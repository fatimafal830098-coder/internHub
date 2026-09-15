import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../api";

import {
  setSelectedInternship,
  setLoading,
  setError,
} from "../redux/internshipSlice";

import { addApplication } from "../redux/applicationSlice";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedInternship, loading, error } = useSelector(
    (state) => state.internship
  );

  const user = useSelector((state) => state.auth.user);

  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await api.get(`/internships/${id}`);

        dispatch(setSelectedInternship(response.data.internship));
      } catch (error) {
        dispatch(
          setError(
            error.response?.data?.message ||
              "Failed to load internship"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchInternship();
  }, [id, dispatch]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      setMessage("Please enter a cover letter.");
      return;
    }

    try {
      const response = await api.post("/applications", {
        internshipId: id,
        coverLetter: coverLetter.trim(),
      });

      dispatch(addApplication(response.data));

      setMessage("Application submitted successfully.");
      setCoverLetter("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    }
  };

  if (loading) {
    return <p>Loading internship...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!selectedInternship) {
    return <p>Internship not found.</p>;
  }

  return (
    <div className="internship-details">
      <button onClick={() => navigate("/internships")}>
        Back to Internships
      </button>

      <h1>{selectedInternship.title}</h1>

      <h2>{selectedInternship.companyName}</h2>

      <p>
        <strong>Description:</strong>{" "}
        {selectedInternship.description}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {selectedInternship.location}
      </p>

      <p>
        <strong>Work Mode:</strong>{" "}
        {selectedInternship.workMode}
      </p>

      <p>
        <strong>Type:</strong>{" "}
        {selectedInternship.type}
      </p>

      <p>
        <strong>Stipend:</strong>{" "}
        {selectedInternship.stipend}
      </p>

      <p>
        <strong>Duration:</strong>{" "}
        {selectedInternship.duration}
      </p>

      <p>
        <strong>Skills:</strong>{" "}
        {selectedInternship.skills?.join(", ")}
      </p>

      <p>
        <strong>Deadline:</strong>{" "}
        {new Date(
          selectedInternship.deadline
        ).toLocaleDateString()}
      </p>

      {user?.role === "student" && (
        <form
          className="application-form"
          onSubmit={handleApply}
        >
          <h2>Apply for this Internship</h2>

          <textarea
            placeholder="Write your cover letter..."
            value={coverLetter}
            onChange={(e) =>
              setCoverLetter(e.target.value)
            }
            required
          />

          <button type="submit">
            Apply Now
          </button>

          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}

export default InternshipDetails;