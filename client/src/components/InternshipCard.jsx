import { Link } from "react-router-dom";

function InternshipCard({ internship }) {
  const deadline = internship.deadline
    ? new Date(internship.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

  return (
    <div className="internship-card">
      <p className="company-name">
        {internship.companyName}
      </p>

      <h3>{internship.title}</h3>

      <p>{internship.description}</p>

      {Array.isArray(internship.skills) &&
        internship.skills.length > 0 && (
          <div className="internship-skills">
            {internship.skills.slice(0, 5).map((skill, index) => (
              <span key={`${skill}-${index}`}>
                {skill}
              </span>
            ))}
          </div>
        )}

      <div className="internship-info">
        <span>{internship.location || "Remote"}</span>
        <span>{internship.workMode || "Remote"}</span>
        <span>{internship.type || "Part-time"}</span>
      </div>

      <div className="internship-meta">
        <p>
          <strong>Stipend</strong>
          <span>{internship.stipend || "Unpaid"}</span>
        </p>

        <p>
          <strong>Duration</strong>
          <span>{internship.duration || "Not specified"}</span>
        </p>
      </div>

      <div className="internship-footer">
        <div>
          <small>Apply before</small>
          <strong>{deadline}</strong>
        </div>

        <Link
          to={`/internships/${internship._id}`}
          className="view-details"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default InternshipCard;