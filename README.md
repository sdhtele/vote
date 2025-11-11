# Student Voting System

A full-stack voting application with admin panel for managing voting images and tracking votes.

## Features

- **Admin Panel**: Add, remove images and manage voting deadlines
- **Voting System**: Users can vote for their favorite images
- **User Verification**: Users must enter name and NIM before voting
- **Vote Prevention**: Each user can only vote once
- **Voting Deadline**: Admins can set deadlines for voting
- **Real-time Updates**: Voting results update automatically
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Bootstrap
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer for image uploads

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory with the following variable:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

## Admin Panel Access

To access the admin panel, navigate to:
```
http://localhost:3000/admin/login
```

## API Endpoints

### Public Endpoints
- `GET /api/votes/images` - Get all images available for voting
- `POST /api/votes/vote` - Submit a vote
- `GET /api/votes/results` - Get current voting results

### Admin Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/admin/images` - Get all images (requires auth)
- `POST /api/admin/images` - Add new image (requires auth)
- `DELETE /api/admin/images/:id` - Delete image (requires auth)
- `GET /api/admin/votes` - Get all votes (requires auth)
- `GET /api/admin/results` - Get voting results (requires auth)
- `GET /api/admin/settings` - Get voting settings (requires auth)
- `POST /api/admin/settings` - Update voting settings (requires auth)

## Admin Credentials

To create an admin account, you'll need to seed the database with an initial admin user. You can do this by creating an account directly in MongoDB or by adding a route for the first admin signup.

## Usage

1. **Admin Setup**:
   - Add images with titles and descriptions
   - Set voting deadline
   - Monitor voting results and users in real-time

2. **User Voting**:
   - Enter your name and NIM
   - Select your favorite image
   - Submit your vote
   - See live results update

## Security Features

- JWT-based authentication for admin panel
- NIM-based duplicate vote prevention
- Server-side validation for all inputs
- File upload validation for images only

## Development

For development, make sure both the backend and frontend servers are running simultaneously.

## Deployment

### Option 1: Traditional Deployment (Recommended)

For production deployment:
- Build the React app with `npm run build` in the frontend directory
- Set `NODE_ENV=production` in your server environment
- The Express server will serve the built React app automatically

### Option 2: Vercel Deployment

This application can be deployed on Vercel with the following considerations:

1. **Frontend on Vercel**: The React frontend can be deployed directly to Vercel
2. **Backend API**: You'll need to deploy the Express backend separately (e.g., on a VPS, Heroku, or Render)
3. **Database**: Use MongoDB Atlas (cloud database) for production

#### Steps for Vercel Deployment:

1. **Prepare your frontend for deployment**:
   - Update the `REACT_APP_API_URL` in your `.env.production` file to point to your backend API URL
   - Example: `REACT_APP_API_URL=https://your-backend-api.com/api`

2. **Deploy the backend separately**:
   - Deploy your Express backend to a hosting platform that supports Node.js
   - Configure your MongoDB connection string for production
   - Make sure CORS is configured to allow requests from your Vercel frontend

3. **Deploy frontend to Vercel**:
   - Push your frontend code to a GitHub repository
   - Connect your repository to Vercel
   - Set environment variables during the deployment process

Example `vercel.json` for frontend deployment:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "build/$1"
    }
  ]
}
```

#### Alternative (Full Stack on Vercel):

If you want to deploy the full stack on Vercel, you would need to convert the Express backend to Vercel serverless functions, which would require significant refactoring of the API routes.

For simplicity and best practices, I recommend deploying the frontend on Vercel and the backend on a platform like Render, Heroku, or a VPS.