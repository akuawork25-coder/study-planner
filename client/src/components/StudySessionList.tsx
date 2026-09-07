import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

type StudySession = {
  id: string;
  course: string;
  date: string;
  duration: number;
  notes: string;
};

const GET_STUDY_SESSIONS = gql`
  query GetStudySessions {
    studySessions {
      id
      course
      date
      duration
      notes
    }
  }
`;

const CREATE_STUDY_SESSION = gql`
  mutation CreateStudySession(
    $course: String!
    $date: String!
    $duration: Int!
    $notes: String
  ) {
    createStudySession(
      course: $course
      date: $date
      duration: $duration
      notes: $notes
    ) {
      id
      course
      date
      duration
      notes
    }
  }
`;

const DELETE_STUDY_SESSION = gql`
  mutation DeleteStudySession($id: ID!) {
    deleteStudySession(id: $id) {
      id
    }
  }
`;

function StudySessionList() {
  const { data, loading, error } = useQuery(GET_STUDY_SESSIONS);

  const [createStudySession] = useMutation(CREATE_STUDY_SESSION, {
    refetchQueries: [{ query: GET_STUDY_SESSIONS }],
  });

  const [deleteStudySession] = useMutation(DELETE_STUDY_SESSION, {
    refetchQueries: [{ query: GET_STUDY_SESSIONS }],
  });

  const sessions: StudySession[] = data?.studySessions ?? [];

  async function addSession() {
    const courseInput = document.querySelector(
      'section:nth-of-type(4) input[placeholder="Course"]'
    ) as HTMLInputElement;

    const dateInput = document.querySelector(
      'section:nth-of-type(4) input[type="date"]'
    ) as HTMLInputElement;

    const durationInput = document.querySelector(
      'input[placeholder="Duration (minutes)"]'
    ) as HTMLInputElement;

    const notesInput = document.querySelector(
      'input[placeholder="Notes"]'
    ) as HTMLInputElement;

    const course = courseInput?.value.trim();
    const date = dateInput?.value;
    const duration = Number(durationInput?.value);
    const notes = notesInput?.value.trim();

    if (!course || !date || !duration) {
      return;
    }

    await createStudySession({
      variables: {
        course,
        date,
        duration,
        notes,
      },
    });

    courseInput.value = "";
    dateInput.value = "";
    durationInput.value = "";
    notesInput.value = "";
  }

  async function deleteSession(id: string) {
    await deleteStudySession({
      variables: {
        id,
      },
    });
  }

  return (
    <section className="study-session-section">
      <div className="section-header">
        <div>
          <h2>Study Sessions</h2>
          <p>Track the time you spend studying.</p>
        </div>
      </div>

      <div className="study-session-form">
        <input
          type="text"
          placeholder="Course"
        />

        <input type="date" />

        <input
          type="number"
          placeholder="Duration (minutes)"
        />

        <input
          type="text"
          placeholder="Notes"
        />

        <button onClick={addSession}>
          Add Study Session
        </button>
      </div>

      {loading && <p>Loading study sessions...</p>}

      {error && <p>Unable to load study sessions.</p>}

      {!loading && sessions.length === 0 && (
        <div className="empty-state">
          <h3>No study sessions yet</h3>
          <p>Add your first study session above.</p>
        </div>
      )}

      <div className="study-session-list">
        {sessions.map((session) => (
          <div className="study-session-card" key={session.id}>
            <div className="study-session-content">
              <h3>{session.course}</h3>

              <div className="study-session-details">
                <p>Date: {session.date}</p>
                <p>Duration: {session.duration} minutes</p>
              </div>

              {session.notes && (
                <p className="study-session-notes">
                  {session.notes}
                </p>
              )}
            </div>

            <button
              className="delete-session-button"
              onClick={() => deleteSession(session.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StudySessionList;