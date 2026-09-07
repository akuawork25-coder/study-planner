import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    courses {
      id
    }

    assignments {
      id
      completed
    }

    studySessions {
      id
      duration
    }
  }
`;

function Dashboard() {
  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);

  const courses = data?.courses ?? [];
  const assignments = data?.assignments ?? [];
  const studySessions = data?.studySessions ?? [];

  const upcomingAssignments = assignments.filter(
    (assignment: { completed: boolean }) => !assignment.completed
  );

  const totalMinutes = studySessions.reduce(
    (total: number, session: { duration: number }) =>
      total + session.duration,
    0
  );

  const studyHours = (totalMinutes / 60).toFixed(1);

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            YOUR OVERVIEW
          </span>

          <h2>Dashboard</h2>

          <p>
            Stay on top of your courses, assignments, and study time.
          </p>
        </div>
      </div>

      {error && <p>Unable to load dashboard.</p>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-icon">
            📚
          </div>

          <span className="dashboard-label">
            Courses
          </span>

          <strong>
            {loading ? "..." : courses.length}
          </strong>

          <p>Active courses</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">
            📝
          </div>

          <span className="dashboard-label">
            Assignments
          </span>

          <strong>
            {loading ? "..." : upcomingAssignments.length}
          </strong>

          <p>Upcoming assignments</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">
            ⏱️
          </div>

          <span className="dashboard-label">
            Study Time
          </span>

          <strong>
            {loading ? "..." : `${studyHours}h`}
          </strong>

          <p>Total study time</p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;