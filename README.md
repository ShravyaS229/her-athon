# her-athon
# CareConnect

CareConnect is a full-stack web application built to connect users who need help with volunteers who can respond to those requests. The project was developed as part of a team effort and focuses on simple community support coordination through separate user and volunteer modules.

## Features

- User registration and login
- Volunteer registration and login
- Password hashing using bcrypt
- Create help requests
- View all help requests
- Accept help requests
- Mark requests as completed
- Basic nearby request handling using location coordinates
- Volunteer verification support through backend approval logic

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Other Packages
- bcryptjs
- cors

## Project Structure

```text
her-athon/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── node_modules/
│   └── her-athon/
│       ├── backend/
│       │   └── server.js
│       └── frontend/
│           ├── css/
│           ├── js/
│           │   └── app.js
│           ├── index.html
│           ├── login.html
│           ├── register-user.html
│           ├── register-volunteer.html
│           ├── user-dashboard.html
│           └── volunteer-dashboard.html
How It Works
Users can register and log in to create help requests.
Volunteers can register and log in to view and respond to requests.
Help requests are stored in MongoDB with request status.
Volunteers can accept requests and later mark them as completed.
Volunteer login can be restricted using backend verification logic.
Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
2. Go to the backend folder
cd her-athon/backend
3. Install dependencies
npm install
4. Go to the folder where server.js exists
cd her-athon/backend
5. Run the backend server
node server.js

If the connection is successful, you should see:

MongoDB Connected
Server running on port 5000
6. Open the frontend

Open the frontend HTML files in a browser from:

her-athon/backend/her-athon/frontend/

Start with:

index.html
or login.html
API Routes
User Routes
POST /api/users/register
POST /api/users/login
Volunteer Routes
POST /api/volunteers/register
POST /api/volunteers/login
Help Request Routes
POST /api/requests/create
GET /api/requests/all
POST /api/requests/accept/:id
POST /api/requests/complete/:id
Volunteer Verification

This project includes backend support for volunteer verification. Newly registered volunteers can be stored with a verification status, and access can be restricted until approval is given.

Current Status

This project has been built and tested in a local environment.

Future Improvements
Admin dashboard for approving volunteers
OTP or email-based volunteer verification
Better nearby request filtering using maps
Improved UI and responsiveness
Deployment for public access
Note

Before pushing this project publicly to GitHub, make sure to remove any real MongoDB connection strings, usernames, or passwords from the code and move them to environment variables.

Hackathon Project

This project was developed as part of a hackathon.
