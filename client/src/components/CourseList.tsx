import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

type Course = {
  id: string;
  name: string;
  instructor: string;
};

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      name
      instructor
    }
  }
`;

const CREATE_COURSE = gql`
  mutation CreateCourse($name: String!, $instructor: String!) {
    createCourse(name: $name, instructor: $instructor) {
      id
      name
      instructor
    }
  }
`;

function CourseList() {
  const { data, loading, error } = useQuery(GET_COURSES);

  const [createCourse] = useMutation(CREATE_COURSE, {
    refetchQueries: [{ query: GET_COURSES }],
  });

  const courses: Course[] = data?.courses ?? [];

  async function addCourse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("courseName") ?? "").trim();
    const instructor = String(formData.get("instructor") ?? "").trim();

    if (!name) {
      return;
    }

    await createCourse({
      variables: {
        name,
        instructor,
      },
    });

    form.reset();
  }

  return (
    <section className="course-section">
      <h2>Courses</h2>

      <form className="course-form" onSubmit={addCourse}>
        <input
          type="text"
          name="courseName"
          placeholder="Course name"
        />

        <input
          type="text"
          name="instructor"
          placeholder="Instructor"
        />

        <button type="submit">Add Course</button>
      </form>

      {loading && <p>Loading courses...</p>}

      {error && <p>Unable to load courses.</p>}

      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <h3>{course.name}</h3>
            <p>{course.instructor}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CourseList;