import Dashboard from "./components/Dashboard";
import CourseList from "./components/CourseList";
import AssignmentList from "./components/AssignmentList";
import StudySessionList from "./components/StudySessionList";

function App() {
  return (
    <div>
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <span className="app-eyebrow">
              STUDY PLANNER
            </span>

            <h1>Study Planner</h1>

            <p>
              Stay organized. Stay on track.
            </p>
          </div>
        </div>
      </header>

      <Dashboard />

      <CourseList />

      <AssignmentList />

      <StudySessionList />
    </div>
  );
}

export default App;