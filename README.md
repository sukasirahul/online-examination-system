# ExamFlow — Online Examination System (React)

A responsive React + Vite frontend starter for an online examination website.

## Run in VS Code

1. Extract this ZIP file.
2. Open the extracted `online-exam-system` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Check that Node.js and npm are installed:
   ```bash
   node -v
   npm -v
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open the local address shown in the terminal (usually http://localhost:5173).

## Demo sign in

- Enter any name.
- Choose **Student** to access the student dashboard.
- Choose **Administrator** to access exam and question management.
- No password is required in this frontend demo.

## Included

- Student dashboard and exam list
- Multiple-choice exam screen with question navigation and countdown
- Automatic result calculation in the browser
- Admin overview, exam management and question bank
- Sample student list
- Responsive layout for desktop and mobile
- Browser localStorage persistence

## Important

This is a frontend learning/demo project. Login roles are not secure authentication, and browser localStorage is not suitable for protecting exam answers or storing real student records. For a real examination service, add a backend API, database, secure authentication, server-side timing and server-side score calculation.
