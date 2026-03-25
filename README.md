# Meeting Diary

A comprehensive meeting management application with AI-powered assistance. This full-stack application helps users schedule, manage, and track meetings with their participants.

## Features

- **User Authentication**: Secure user registration and login with JWT-based authentication
- **Meeting Management**: Create, update, delete, and retrieve meetings
- **Participant Management**: Add/remove participants from meetings and manage their attendance status
- **Meeting History**: View past meetings and meeting details
- **AI Assistant**: Intelligent AI-powered assistant for meeting insights and intent parsing
- **Calendar Integration**: Visual calendar view of meetings with FullCalendar
- **User Profiles**: View and edit user profile information
- **Responsive UI**: Modern, responsive design with Material-UI and Tailwind CSS

## Project Architecture & Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      MEETING DIARY ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              REACT FRONTEND (meeting-diary-fronend)        │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │ │
│  │  │  Welcome     │  │  Login/      │  │   Dashboard     │   │ │
│  │  │  Page        │→ │  Signup      │→ │   Pages         │   │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘   │ │
│  │         ↓                    ↓              ↓              │ │
│  │     [JWT Token]         [Store Token]   [Navigate Routes]  │ │
│  │                                                            │ │
│  │  Dashboard Sub-Pages:                                      │ │
│  │  ├─ Calendar Page                                          │ │
│  │  ├─ Meeting Details                                        │ │
│  │  ├─ Edit Meeting Modal                                     │ │
│  │  ├─ Participants Management                                │ │
│  │  ├─ Edit Profile Page                                      │ │
│  │  ├─ History Page                                           │ │
│  │  └─ Floating AI Assistant                                  │ │
│  │                                                            │ │
│  │  API Client Layer (Api.js)                                 │ │
│  │  └─ Handles all HTTP requests to backend                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓ HTTP/REST                            │
│                   (JWT Auth Headers)                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          EXPRESS BACKEND (meeting-diary-backend)          │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │         API Routes (api/)                           │  │  │
│  │  │  ├─ userApi.js       → /api/users/*                 │  │  │
│  │  │  ├─ meetingApi.js    → /api/meetings/*              │  │  │
│  │  │  └─ participantsApi.js → /api/participants/*        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                   ↓                                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │      Middleware (middleware/auth.js)                │  │  │
│  │  │  ├─ JWT Verification                                │  │  │
│  │  │  └─ Request Authentication                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                   ↓                                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │     Controllers (controllers/)                      │  │  │
│  │  │  ├─ userControl.js       (Auth logic)               │  │  │
│  │  │  ├─ meetingControl.js    (Meeting CRUD)             │  │  │
│  │  │  └─ participantsControl.js (Attendee management)    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                   ↓                                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │       Models (models/)                              │  │  │
│  │  │  ├─ userQuery.js       (User DB queries)            │  │  │
│  │  │  ├─ meetingQuery.js    (Meeting DB queries)         │  │  │
│  │  │  └─ participantsQuery.js (Participant DB query)     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓ Sequelize ORM                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │      DATABASE (MySQL/PostgreSQL)                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                │   │
│  │  │ USERS           │  │ MEETINGS        │                │   │
│  │  │─────────────────│  │─────────────────│                │   │
│  │  │ id (PK)         │  │ id (PK)         │                │   │
│  │  │ username        │  │ title           │                │   │
│  │  │ email           │  │ description     │                │   │
│  │  │ password (hash) │  │ date_time       │                │   │
│  │  │ ...             │  │ location        │                │   │
│  │  │                 │  │ creator_id (FK) │                │   │
│  │  └─────────────────┘  └─────────────────┘                │   │
│  │           ↓                     ↓                        │   │
│  │           └─────┬───────┬──────┘                         │   │
│  │                 ↓       ↓                                │   │
│  │  ┌────────────────────────────────┐                      │   │
│  │  │ PARTICIPANTS                   │                      │   │
│  │  │────────────────────────────────│                      │   │
│  │  │ id (PK)                        │                      │   │
│  │  │ meeting_id (FK) → MEETINGS     │                      │   │
│  │  │ user_id (FK) → USERS           │                      │   │
│  │  │ status (attending/declined)    │                      │   │
│  │  └────────────────────────────────┘                      │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         AI ASSISTANT MODULE                              │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ├─ aiIntentParser.js (Parse user natural language)      │   │
│  │  └─ FloatingAIAssistant.jsx (UI Component)               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

DATA FLOW EXAMPLE: User Creates Meeting
────────────────────────────────────────
1. User fills form in Dashboard
2. Frontend sends POST request to /api/meetings with JWT token
3. Middleware verifies token
4. meetingControl validates data
5. meetingQuery inserts into DATABASE
6. Database returns meeting_id
7. Response sent back to frontend
8. Frontend updates Calendar view
```

## Screenshots & Preview

Get a glimpse of the Meeting Diary interface:

### Welcome Page
![Welcome Screen](![alt text](image-1.png))
*Landing page when opening the app - before login or signup*

### Authentication
![Login Page](./screenshots/login.png)
*User login interface*

![Signup Page](./screenshots/signup.png)
*User registration page*

### Main Dashboard
![Dashboard Overview](./screenshots/dashboard.png)
*Main dashboard with meeting overview*

### Calendar View
![Calendar](./screenshots/calendar.png)
*Interactive calendar showing all scheduled meetings*

### Meeting Management
![Meeting Details](./screenshots/meeting-details.png)
*View and manage meeting details with participants*

![Edit Meeting](./screenshots/edit-meeting.png)
*Edit meeting information modal*

### Participants
![Participants List](./screenshots/participants.png)
*Add and manage meeting participants*

### AI Assistant
![AI Assistant](./screenshots/ai-assistant.png)
*Floating AI assistant for intelligent meeting insights*

### User Profile
![User Profile](./screenshots/profile.png)
*Edit and view user profile information*

### Meeting History
![History](./screenshots/history.png)
*View past meetings and history*

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js 5.x
- **Database**: MySQL/PostgreSQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken) with bcrypt password hashing
- **API**: RESTful API with CORS support

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Material-UI components
- **Routing**: React Router v7
- **Calendar**: FullCalendar
- **UI Components**: Material-UI, React Icons
- **Date Handling**: Day.js

## Project Structure

```
meeting-diary-new/
├── meeting-diary-backend/          # Express.js backend
│   ├── api/                        # API route handlers
│   │   ├── userApi.js
│   │   ├── meetingApi.js
│   │   └── participantsApi.js
│   ├── controllers/                # Business logic
│   │   ├── userControl.js
│   │   ├── meetingControl.js
│   │   └── participantsControl.js
│   ├── models/                     # Sequelize models
│   ├── middleware/                 # Auth middleware
│   ├── config/                     # Database configuration
│   ├── sql/                        # Database schemas and seed data
│   ├── test-data/                  # Sample API request/response data
│   └── index.js                    # Server entry point
│
├── meeting-diary-fronend/          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Welcome.jsx
│   │   │   └── DashboardPages/     # Dashboard sub-pages
│   │   │       ├── CalendarPage.jsx
│   │   │       ├── HistoryPage.jsx
│   │   │       ├── EditMeetingModal.jsx
│   │   │       ├── EditProfilePage.jsx
│   │   │       ├── FloatingAIAssistant.jsx
│   │   │       └── ...
│   │   ├── Services/
│   │   │   └── Api.js              # API client
│   │   ├── utils/
│   │   │   └── aiIntentParser.js   # AI intent parsing
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── testAI/                         # AI testing utilities
├── tests/                          # Python test files
├── Jenkinsfile                     # CI/CD configuration
└── requirements.txt                # Python dependencies

```

## Installation

### Prerequisites
- Node.js 20.x
- npm or yarn
- MySQL or PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd meeting-diary-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the `meeting-diary-backend` directory with:
```
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=meeting_diary
JWT_SECRET=your_jwt_secret
```

4. Set up the database:
```bash
# Navigate to the sql directory and run the setup scripts
cd sql
# Run: 00_reset.sql, 01_schema.sql, 02_seed_data.sql
```

5. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd meeting-diary-fronend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Running the Application

### Development

**Backend:**
```bash
cd meeting-diary-backend
npm start
```

**Frontend:**
```bash
cd meeting-diary-fronend
npm run dev
```

### Production Build

**Frontend:**
```bash
cd meeting-diary-fronend
npm run build
npm run preview
```

## API Endpoints

### Users
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Meetings
- `POST /api/meetings` - Create a new meeting
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/:id` - Get meeting by ID
- `GET /api/meetings/user/:userId` - Get meetings by user
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

### Participants
- `POST /api/participants` - Add participant to meeting
- `GET /api/participants/meeting/:meetingId` - Get participants by meeting
- `GET /api/participants/available-users/:meetingId` - Get users not in meeting
- `PUT /api/participants/:id/status` - Update participant status
- `DELETE /api/participants/:id` - Remove participant from meeting

## Testing

### Test Data
Sample API request and response files are available in `meeting-diary-backend/test-data/` for reference during development.

### Running Tests
```bash
cd tests
python test_login.py
```

## Database Schema

The application uses three main tables:
- **users**: User account information and authentication
- **meetings**: Meeting details and scheduling information
- **participants**: Join table for meeting participants and their status

See `meeting-diary-backend/sql/01_schema.sql` for the complete schema.

## Security

- Passwords are hashed using bcrypt
- User authentication via JWT tokens
- CORS enabled for frontend communication
- Input validation on API endpoints

## Key Features Explained

### AI Assistant
The application includes an AI-powered assistant that:
- Parses user intent from natural language
- Provides meeting insights and suggestions
- Helps with scheduling optimization

Access the AI assistant via the floating AI button on the dashboard.

### Calendar Integration
View all your meetings in an interactive calendar interface with FullCalendar integration. Click on meetings to view or edit details.

### Meeting History
Track past meetings with full meeting details, participants, and status information.

## Development

### Code Style
- Backend: Node.js commonjs modules
- Frontend: React with ES modules
- Linting: ESLint configured for the frontend

Run linter:
```bash
cd meeting-diary-fronend
npm run lint
```

### File Naming Conventions
- API handlers: `*Api.js`
- Business logic: `*Control.js`
- Data models: `*Query.js`
- React components: `*.jsx`

## Troubleshooting

**Backend won't start:**
- Verify Node.js version is 20.x
- Check database connection settings in `.env`
- Ensure database is running and initialized

**Frontend won't load:**
- Clear node_modules and reinstall: `npm ci`
- Check that backend is running on port 3000
- Clear browser cache

**Database issues:**
- Run the SQL scripts in order: 00_reset.sql → 01_schema.sql → 02_seed_data.sql
- Verify database credentials match `.env` file

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Contact & Support

For issues or questions about this project, please check the test data and documentation in the `meeting-diary-backend/test-data/` directory for API examples.

---

**Last Updated**: March 2026
