# Markdown Blog with Authentication

A full-stack markdown blog application with user authentication and post management. The application allows users to create, edit, and view posts with markdown styling.

## Features

- 🔐 User Authentication (Login/Register)
- ✍️ Markdown Editor with Live Preview
- 📝 Create, Read, Update, and Delete Posts
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time Markdown Preview
- 📱 Responsive Design
- 🔔 Toast Notifications for User Feedback

## Tech Stack

### Frontend

- React with TypeScript
- Tailwind CSS for styling
- @uiw/react-md-editor for markdown editing
- react-markdown for markdown rendering
- Axios for API calls

### Backend

- Node.js with Express
- SQLite3 for database
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Important Note

The main frontend component is `src/Components/Login.tsx`, which contains the complete markdown blog functionality. Other files in the frontend are from a previous project and are not part of this application.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with:

   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the project root directory:

   ```bash
   cd ..
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Posts

- `GET /api/posts` - Get all posts for authenticated user
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Usage

1. Register a new account or login with existing credentials
2. Create a new post using the markdown editor
3. Preview your markdown in real-time
4. Save your post
5. View, edit, or delete your posts from the list

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation and sanitization
- SQL injection prevention
- CORS enabled
- Protected routes

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Vinayak Dwivedi
