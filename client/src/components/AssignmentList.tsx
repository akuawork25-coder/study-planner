import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

type Assignment = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: string;
  completed: boolean;
};

const GET_ASSIGNMENTS = gql`
  query GetAssignments {
    assignments {
      id
      title
      course
      dueDate
      priority
      completed
    }
  }
`;

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

const CREATE_ASSIGNMENT = gql`
  mutation CreateAssignment(
    $title: String!
    $course: String!
    $dueDate: String!
    $priority: String!
  ) {
    createAssignment(
      title: $title
      course: $course
      dueDate: $dueDate
      priority: $priority
    ) {
      id
      title
      course
      dueDate
      priority
      completed
    }
  }
`;

const UPDATE_ASSIGNMENT = gql`
  mutation UpdateAssignment($id: ID!, $completed: Boolean!) {
    updateAssignment(id: $id, completed: $completed) {
      id
      completed
    }
  }
`;

function AssignmentList() {
  const { data, loading, error } = useQuery(GET_ASSIGNMENTS);

  const [createAssignment] = useMutation(CREATE_ASSIGNMENT, {
    refetchQueries: [
      { query: GET_ASSIGNMENTS },
      { query: GET_DASHBOARD_DATA },
    ],
  });

  const [updateAssignment] = useMutation(UPDATE_ASSIGNMENT, {
    refetchQueries: [
      { query: GET_ASSIGNMENTS },
      { query: GET_DASHBOARD_DATA },
    ],
  });

  const assignments: Assignment[] = data?.assignments ?? [];

  const sortedAssignments = [...assignments].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate)
  );

  async function addAssignment() {
    const titleInput = document.querySelector(
      'input[placeholder="Assignment title"]'
    ) as HTMLInputElement;

    const courseInput = document.querySelector(
      'input[placeholder="Course"]'
    ) as HTMLInputElement;

    const dateInput = document.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;

    const priorityInput = document.querySelector(
      "select"
    ) as HTMLSelectElement;

    const title = titleInput.value.trim();
    const course = courseInput.value.trim();
    const dueDate = dateInput.value;
    const priority = priorityInput.value;

    if (!title || !course || !dueDate) {
      return;
    }

    await createAssignment({
      variables: {
        title,
        course,
        dueDate,
        priority,
      },
    });

    titleInput.value = "";
    courseInput.value = "";
    dateInput.value = "";
    priorityInput.value = "Medium";
  }

  async function toggleAssignment(assignment: Assignment) {
    await updateAssignment({
      variables: {
        id: assignment.id,
        completed: !assignment.completed,
      },
    });
  }

  return (
    <section className="assignment-section">
      <div className="section-header">
        <div>
          <h2>Assignments</h2>
          <p>Keep track of what needs to get done.</p>
        </div>
      </div>

      <div className="assignment-form">
        <input
          type="text"
          placeholder="Assignment title"
        />

        <input
          type="text"
          placeholder="Course"
        />

        <input type="date" />

        <select defaultValue="Medium">
          <option value="Low">Low priority</option>
          <option value="Medium">Medium priority</option>
          <option value="High">High priority</option>
        </select>

        <button onClick={addAssignment}>
          Add Assignment
        </button>
      </div>

      {loading && <p>Loading assignments...</p>}

      {error && <p>Unable to load assignments.</p>}

      {!loading && assignments.length === 0 && (
        <div className="empty-state">
          <h3>No assignments yet</h3>
          <p>Add your first assignment above.</p>
        </div>
      )}

      <div className="assignment-list">
        {sortedAssignments.map((assignment) => (
          <div
            className={`assignment-card ${
              assignment.completed ? "assignment-completed" : ""
            }`}
            key={assignment.id}
          >
            <div className="assignment-content">
              <div className="assignment-title-row">
                <h3>{assignment.title}</h3>

                <span
                  className={`priority-badge priority-${assignment.priority.toLowerCase()}`}
                >
                  {assignment.priority}
                </span>
              </div>

              <p className="assignment-course">
                {assignment.course}
              </p>

              <p className="assignment-due">
                Due: {assignment.dueDate}
              </p>
            </div>

            <div className="assignment-actions">
              <span
                className={`assignment-status ${
                  assignment.completed
                    ? "status-completed"
                    : "status-pending"
                }`}
              >
                {assignment.completed
                  ? "Completed"
                  : "Not completed"}
              </span>

              <button
                className="assignment-button"
                onClick={() => toggleAssignment(assignment)}
              >
                {assignment.completed
                  ? "Mark incomplete"
                  : "Mark complete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AssignmentList;