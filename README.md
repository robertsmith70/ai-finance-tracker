Ai finance tracker app,
track income and expensences
visulaize spending
get recommendations
Express will be used for the middleware to create various CRUD endpoints.
Mongoose for managing data in MongoDB using various queries.
Nodemon to restart our server every time we save our file.

📘 Project Overview
AI Finance Tracker (Backend)
This project began as a basic Express and MongoDB application to track financial expenses. Over time, it has evolved through several key architectural and security improvements to reflect real-world development practices.

🚀 Key Iterations & Progress
Initial Setup:

Built with Node.js, Express, and MongoDB using Mongoose for schema modeling.

Implemented basic CRUD operations for expense tracking.

Modular Architecture:

Refactored code into a clean MVC structure:
controllers/, models/, routes/, and middleware/.

Introduced centralized error handling and route organization.

User Authentication:

Integrated secure JWT-based authentication.

Added registration and login functionality.

Passwords are hashed with bcrypt; tokens are stored in secure HTTP-only cookies.

Protected Routes & Ownership:

Users can only access their own expense data.

Middleware verifies tokens and ensures route protection.

Data Validation & Security Practices:

Backend includes input validation and field checking.

Structured to support future additions like helmet, rate limiting, and data sanitization.

✅ Features Implemented
User registration & login with hashed passwords

Authenticated routes using JWT & cookies

Expense CRUD (Create, Read, Update, Delete)

Per-user data protection & ownership

Modular codebase with scalable folder structure
