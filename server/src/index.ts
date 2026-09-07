import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./database.js";

const typeDefs = `#graphql
  type Course {
    id: ID!
    name: String!
    instructor: String!
  }

  type Assignment {
    id: ID!
    title: String!
    course: String!
    dueDate: String!
    priority: String!
    completed: Boolean!
  }

  type StudySession {
    id: ID!
    course: String!
    date: String!
    duration: Int!
    notes: String
  }

  type Query {
    courses: [Course!]!
    assignments: [Assignment!]!
    studySessions: [StudySession!]!
  }

  type Mutation {
    createCourse(name: String!, instructor: String!): Course!

    createAssignment(
      title: String!
      course: String!
      dueDate: String!
      priority: String!
    ): Assignment!

    updateAssignment(
      id: ID!
      completed: Boolean!
    ): Assignment!

    deleteStudySession(id: ID!): StudySession!

    createStudySession(
      course: String!
      date: String!
      duration: Int!
      notes: String
    ): StudySession!
  }
`;

const resolvers = {
  Query: {
    courses: () => {
      return db
        .prepare(
          `
          SELECT id, name, instructor
          FROM courses
          ORDER BY id
          `
        )
        .all();
    },

    assignments: () => {
      const rows = db
        .prepare(
          `
          SELECT
            id,
            title,
            course,
            dueDate,
            priority,
            completed
          FROM assignments
          ORDER BY id
          `
        )
        .all() as Array<{
        id: number;
        title: string;
        course: string;
        dueDate: string;
        priority: string;
        completed: number;
      }>;

      return rows.map((assignment) => ({
        ...assignment,
        completed: Boolean(assignment.completed),
      }));
    },

    studySessions: () => {
      return db
        .prepare(
          `
          SELECT
            id,
            course,
            date,
            duration,
            notes
          FROM study_sessions
          ORDER BY id
          `
        )
        .all();
    },
  },

  Mutation: {
    createCourse: (
      _: unknown,
      args: {
        name: string;
        instructor: string;
      }
    ) => {
      const result = db
        .prepare(
          `
          INSERT INTO courses (name, instructor)
          VALUES (?, ?)
          `
        )
        .run(args.name, args.instructor);

      return db
        .prepare(
          `
          SELECT id, name, instructor
          FROM courses
          WHERE id = ?
          `
        )
        .get(result.lastInsertRowid);
    },

    createAssignment: (
      _: unknown,
      args: {
        title: string;
        course: string;
        dueDate: string;
        priority: string;
      }
    ) => {
      const result = db
        .prepare(
          `
          INSERT INTO assignments (
            title,
            course,
            dueDate,
            priority,
            completed
          )
          VALUES (?, ?, ?, ?, 0)
          `
        )
        .run(
          args.title,
          args.course,
          args.dueDate,
          args.priority
        );

      const assignment = db
        .prepare(
          `
          SELECT
            id,
            title,
            course,
            dueDate,
            priority,
            completed
          FROM assignments
          WHERE id = ?
          `
        )
        .get(result.lastInsertRowid) as {
        id: number;
        title: string;
        course: string;
        dueDate: string;
        priority: string;
        completed: number;
      };

      return {
        ...assignment,
        completed: Boolean(assignment.completed),
      };
    },

    updateAssignment: (
      _: unknown,
      args: {
        id: string;
        completed: boolean;
      }
    ) => {
      const result = db
        .prepare(
          `
          UPDATE assignments
          SET completed = ?
          WHERE id = ?
          `
        )
        .run(args.completed ? 1 : 0, Number(args.id));

      if (result.changes === 0) {
        throw new Error("Assignment not found");
      }

      const assignment = db
        .prepare(
          `
          SELECT
            id,
            title,
            course,
            dueDate,
            priority,
            completed
          FROM assignments
          WHERE id = ?
          `
        )
        .get(Number(args.id)) as {
        id: number;
        title: string;
        course: string;
        dueDate: string;
        priority: string;
        completed: number;
      };

      return {
        ...assignment,
        completed: Boolean(assignment.completed),
      };
    },

    deleteStudySession: (
      _: unknown,
      args: {
        id: string;
      }
    ) => {
      const session = db
        .prepare(
          `
          SELECT
            id,
            course,
            date,
            duration,
            notes
          FROM study_sessions
          WHERE id = ?
          `
        )
        .get(Number(args.id));

      if (!session) {
        throw new Error("Study session not found");
      }

      db.prepare(
        `
        DELETE FROM study_sessions
        WHERE id = ?
        `
      ).run(Number(args.id));

      return session;
    },

    createStudySession: (
      _: unknown,
      args: {
        course: string;
        date: string;
        duration: number;
        notes?: string;
      }
    ) => {
      const result = db
        .prepare(
          `
          INSERT INTO study_sessions (
            course,
            date,
            duration,
            notes
          )
          VALUES (?, ?, ?, ?)
          `
        )
        .run(
          args.course,
          args.date,
          args.duration,
          args.notes ?? ""
        );

      return db
        .prepare(
          `
          SELECT
            id,
            course,
            date,
            duration,
            notes
          FROM study_sessions
          WHERE id = ?
          `
        )
        .get(result.lastInsertRowid);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`GraphQL server running at ${url}`);