import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api";
import InternshipCard from "../components/InternshipCard";

import {
  setInternships,
  setLoading,
  setError,
} from "../redux/internshipSlice";

function Internships() {
  const dispatch = useDispatch();

  const {
    internships,
    loading,
    error,
  } = useSelector((state) => state.internship);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [type, setType] = useState("");
  const [skill, setSkill] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await api.get("/internships");

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.internships)
          ? response.data.internships
          : Array.isArray(response.data.data)
          ? response.data.data
          : [];

        dispatch(setInternships(data));
      } catch (error) {
        dispatch(
          setError(
            error.response?.data?.message ||
              "Failed to load internships"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchInternships();
  }, [dispatch]);

  const filteredInternships = Array.isArray(internships)
    ? internships.filter((internship) => {
        const searchText = search.toLowerCase().trim();
        const locationText = location.toLowerCase().trim();
        const skillText = skill.toLowerCase().trim();

        const title = (internship.title || "").toLowerCase();
        const company = (
          internship.companyName || ""
        ).toLowerCase();

        const internshipLocation = (
          internship.location || ""
        ).toLowerCase();

        const internshipSkills = Array.isArray(
          internship.skills
        )
          ? internship.skills.map((item) =>
              item.toLowerCase()
            )
          : [];

        const matchesSearch =
          !searchText ||
          title.includes(searchText) ||
          company.includes(searchText);

        const matchesLocation =
          !locationText ||
          internshipLocation.includes(locationText);

        const matchesWorkMode =
          !workMode ||
          internship.workMode === workMode;

        const matchesType =
          !type ||
          internship.type === type;

        const matchesSkill =
          !skillText ||
          internshipSkills.some((item) =>
            item.includes(skillText)
          );

        return (
          matchesSearch &&
          matchesLocation &&
          matchesWorkMode &&
          matchesType &&
          matchesSkill
        );
      })
    : [];

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setWorkMode("");
    setType("");
    setSkill("");
  };

  const hasFilters =
    search ||
    location ||
    workMode ||
    type ||
    skill;

  return (
    <div className="internships-page">
      <div className="internships-header">
        <div>
          <h1>Find Your Internship</h1>
          <p>
            Explore opportunities that match your
            skills and career goals.
          </p>
        </div>

        <span className="internship-count">
          {filteredInternships.length} opportunities
        </span>
      </div>

      <div className="internship-filters">
        <input
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Skill..."
          value={skill}
          onChange={(e) =>
            setSkill(e.target.value)
          }
        />

        <select
          value={workMode}
          onChange={(e) =>
            setWorkMode(e.target.value)
          }
        >
          <option value="">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading && (
        <div className="internship-message">
          <p>Loading internships...</p>
        </div>
      )}

      {error && (
        <div className="internship-message error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredInternships.length === 0 ? (
            <div className="internship-empty">
              <div className="empty-icon">🔎</div>

              <h2>No internships found</h2>

              <p>
                Try changing your search or filters
                to find more opportunities.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-empty-button"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="internship-list">
              {filteredInternships.map(
                (internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                  />
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Internships;