import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "../api";
import ApplicationCard from "../components/ApplicationCard";

import {
  setApplications,
  setLoading,
  setError,
} from "../redux/applicationSlice";

function Applications() {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    applications,
    loading,
    error,
  } = useSelector(
    (state) => state.application
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const endpoint =
          user?.role === "recruiter"
            ? "/applications/recruiter"
            : "/applications/mine";

        const response = await api.get(endpoint);

        dispatch(
          setApplications(
            response.data.applications || []
          )
        );
      } catch (error) {
        dispatch(
          setError(
            error.response?.data?.message ||
              "Failed to load applications"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, dispatch]);

  if (!user) {
    return <p>Please login first.</p>;
  }

  return (
    <div className="applications-page">
      <h1>Applications</h1>

      {loading && (
        <p>Loading applications...</p>
      )}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="application-list">
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            applications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Applications;