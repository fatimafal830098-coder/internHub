import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "../api";
import {
  updateApplication,
  setError,
} from "../redux/applicationSlice";

function ApplicationCard({ application }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      dispatch(setError(null));

      const response = await api.patch(
        `/applications/${application._id}/status`,
        {
          status,
        }
      );

      dispatch(updateApplication(response.data.application));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to update application"
        )
      );
    } finally {
      setUpdating(false);
    }
  };

  const isRecruiter = user?.role === "recruiter";

  const formattedStatus = application.status
    ?.replace("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  return (
    <div className="application-card">
      <h3>
        {application.internship?.title || "Internship"}
      </h3>

      <p>
        <strong>Company:</strong>{" "}
        {application.internship?.companyName || "N/A"}
      </p>

      {isRecruiter && (
        <>
          <p>
            <strong>Student:</strong>{" "}
            {application.student?.name || "N/A"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {application.student?.email || "N/A"}
          </p>

          {application.student?.phone && (
            <p>
              <strong>Phone:</strong>{" "}
              {application.student.phone}
            </p>
          )}

          {application.student?.skills && (
            <p>
              <strong>Skills:</strong>{" "}
              {application.student.skills}
            </p>
          )}
        </>
      )}

      <p>
        <strong>Status:</strong>{" "}
        <span className="application-status">
          {formattedStatus}
        </span>
      </p>

      {application.coverLetter && (
        <p>
          <strong>Cover Letter:</strong>{" "}
          {application.coverLetter}
        </p>
      )}

      {application.interviewDate && (
        <p>
          <strong>Interview:</strong>{" "}
          {new Date(
            application.interviewDate
          ).toLocaleString()}
        </p>
      )}

      {application.interviewNote && (
        <p>
          <strong>Interview Note:</strong>{" "}
          {application.interviewNote}
        </p>
      )}

      {isRecruiter && (
        <div className="application-actions">
          <button
            type="button"
            onClick={() => updateStatus("under_review")}
            disabled={updating}
          >
            Under Review
          </button>

          <button
            type="button"
            onClick={() => updateStatus("shortlisted")}
            disabled={updating}
          >
            Shortlist
          </button>

          <button
            type="button"
            onClick={() => updateStatus("interview")}
            disabled={updating}
          >
            Interview
          </button>

          <button
            type="button"
            onClick={() => updateStatus("accepted")}
            disabled={updating}
          >
            Accept
          </button>

          <button
            type="button"
            onClick={() => updateStatus("rejected")}
            disabled={updating}
          >
            Reject
          </button>
        </div>
      )}

      {application.internship?._id && (
        <Link
          to={`/internships/${application.internship._id}`}
          className="view-details"
        >
          View Internship
        </Link>
      )}
    </div>
  );
}

export default ApplicationCard;