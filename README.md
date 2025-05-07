# BookEase - Library Book Reservation System

BookEase is a MERN (MongoDB, Express, React, Node.js) stack application designed for library book reservation management. It provides a platform for students to search, reserve, and review books, while giving administrators tools to manage the library inventory and reservations.

## Features

### Student Features
- User authentication (login/signup)
- Book search by title, author, and genre
- Real-time book availability status
- Book reservation system
- Book ratings and reviews
- Reservation reminders
- Student dashboard (current reservations, due dates)

### Admin Features
- Admin panel to add/remove books
- Manage book reservations
- Monitor user activity

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API requests
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Models

### User
- Role (student/admin)
- Authentication details
- Profile information

### Book
- Title, author, genre
- Rating, availability status
- Other metadata

### Reservation
- Book ID, User ID
- Due date, status

### Reviews
- User ID, Book ID
- Star rating, comment

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Run the development servers

## License
MIT
