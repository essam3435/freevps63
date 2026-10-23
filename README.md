# 🔐 Account Management Dashboard

A modern, secure account management web application built with Flask and React. Manage user accounts, sessions, security settings, and activity logs all in one place.

## Features

✨ **User Authentication**
- Secure registration and login
- JWT-based authentication
- Password hashing with bcrypt

👤 **Profile Management**
- View and update profile information
- Change email address
- Account creation timestamp and last login tracking

📱 **Session Management**
- View all active sessions
- See device information and IP addresses
- Revoke sessions remotely
- Track session activity

🔐 **Security Features**
- Change password securely
- Two-Factor Authentication (2FA) with QR codes
- Activity logging for all account changes
- IP address tracking

📊 **Activity Monitoring**
- Complete activity log with timestamps
- Track all account changes
- Monitor login/logout history
- View security-related actions

## Tech Stack

**Backend:**
- Flask 2.3.3
- Flask-SQLAlchemy (Database ORM)
- Flask-JWT-Extended (Authentication)
- PyOTP (Two-Factor Authentication)
- bcrypt (Password hashing)

**Frontend:**
- React 18.2.0
- React Router 6.14.2
- Axios (HTTP client)
- CSS3 with Flexbox/Grid

**Deployment:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Gunicorn (Production server)

## Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd freevps63
```

2. **Backend Setup**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask app
python app.py
```

The backend will be available at `http://localhost:5000`

3. **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

### Using Docker

1. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

This will:
- Start the Flask backend on `http://localhost:5000`
- Mount the current directory for live code reloading

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile/update` - Update profile

### Password
- `POST /api/password/change` - Change password

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions/<id>/revoke` - Revoke a session

### Two-Factor Authentication
- `POST /api/2fa/enable` - Generate 2FA QR code
- `POST /api/2fa/confirm` - Confirm 2FA setup
- `POST /api/2fa/disable` - Disable 2FA

### Activity
- `GET /api/activity` - Get activity log

## Environment Variables

Create a `.env` file:
```
FLASK_ENV=development
DATABASE_URL=sqlite:///account_manager.db
JWT_SECRET_KEY=your-secret-key-change-in-production
```

## GitHub Actions CI/CD

The project includes automated workflows:

1. **Test Workflow** (`.github/workflows/deploy.yml`)
   - Runs on push to main branches
   - Tests against Python 3.9, 3.10, 3.11
   - Uploads coverage reports to Codecov

2. **Deploy Workflow**
   - Automatically deploys when tests pass
   - Triggered on push to `ccr-53eb1065-otskkd` branch

## Database

The application uses SQLite by default (perfect for development). For production, modify `DATABASE_URL` in `.env` to use PostgreSQL:

```
DATABASE_URL=postgresql://user:password@localhost/account_manager
```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-cov

# Run tests
pytest tests/ -v --cov=.
```

## Security Best Practices

✅ Passwords hashed with bcrypt
✅ JWT tokens with expiration
✅ CORS configured for security
✅ Activity logging for audit trail
✅ Two-Factor Authentication support
✅ Session revocation capability

## Project Structure

```
freevps63/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions workflow
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── Sessions.js
│   │   │   ├── Security.js
│   │   │   └── Activity.js
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   └── styles/
│   └── package.json
└── README.md
```

## Deployment

### Using GitHub Pages (Frontend only)
```bash
cd frontend
npm run build
# Deploy the build/ folder to GitHub Pages
```

### Using Render/Railway/Heroku (Full Stack)
1. Connect your GitHub repository
2. Set build command: `pip install -r requirements.txt && npm install && cd frontend && npm run build`
3. Set start command: `gunicorn --bind 0.0.0.0:5000 app:app`
4. Add environment variables in the platform dashboard

### Using Docker
```bash
docker build -t account-manager .
docker run -p 5000:5000 account-manager
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for secure account management**
