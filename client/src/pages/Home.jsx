import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to InternHub</h1>

        <p>
          Find internships, build your profile,
          and connect with recruiters.
        </p>

        <div className="hero-buttons">
          <Link to="/internships">
            Find Internships
          </Link>

          <Link to="/register">
            Create Account
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Use InternHub?</h2>

        <div className="feature-list">
          <div className="feature-card">
            <h3>Find Internships</h3>
            <p>
              Search for internships that match
              your skills and interests.
            </p>
          </div>

          <div className="feature-card">
            <h3>Build Your Profile</h3>
            <p>
              Add your education, skills,
              projects, and resume.
            </p>
          </div>

          <div className="feature-card">
            <h3>Connect With Recruiters</h3>
            <p>
              Apply for internships and communicate
              with recruiters.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;