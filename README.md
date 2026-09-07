# Study Planner

A full-stack web application for organizing courses, assignments, and study sessions in one place.

## Features

- Add and manage courses
- Create assignments with due dates and priorities
- Sort assignments by priority and due date
- Mark assignments as completed
- Record study sessions and study duration
- Delete study sessions
- Dashboard with:
  - Active course count
  - Upcoming assignment count
  - Total study time
- Persistent data storage with SQLite
- GraphQL API for frontend/backend communication
- Responsive user interface

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Apollo Client
- HTML/CSS

### Backend
- Node.js
- Apollo Server
- GraphQL
- SQLite
- better-sqlite3

## Architecture

The application uses a React frontend that communicates with a Node.js GraphQL backend through Apollo Client.

The backend uses SQLite for persistent data storage.

```text
React + TypeScript
        |
        v
   Apollo Client
        |
        v
   GraphQL API
        |
        v
   Apollo Server
        |
        v
      SQLite