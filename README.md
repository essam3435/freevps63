# Telegram Session Manager

A React Native mobile app for managing Telegram sessions using Telethon. Clone sessions, manage OTP codes, and auto-terminate old sessions.

## Features

- ✅ **Upload & Import Sessions** - Import Telethon session files + JSON credentials
- ✅ **Session Management** - View all sessions with status and details
- ✅ **Clone Sessions** - Create new sessions from existing ones
- ✅ **OTP Management** - Store and view OTP codes for sessions
- ✅ **Session Termination** - Kill individual sessions or auto-terminate sessions older than 24 hours
- ✅ **Session Status Tracking** - Active, Inactive, Terminated states
- ✅ **Auto Cleanup** - Automatically terminate sessions after 24 hours

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo Go app on your Android/iOS phone (or Android Emulator)

### Installation

```bash
# Install dependencies
npm install

# Start the dev server
npm start
```

### Running on Android

**Option 1: Expo Go (Easiest)**
```bash
npm start
# Scan QR code with your phone's camera or Expo Go app
```

**Option 2: Android Emulator**
```bash
npm run android
```

**Option 3: Build APK** (for testing on device without Expo Go)
```bash
eas build --platform android --profile preview
# Download the APK and install on your device
```

### Running on iOS

```bash
npm run ios
```

## Project Structure

```
freevps63/
├── app/                    # App screens and navigation
│   ├── _layout.tsx        # Root layout with auto-cleanup setup
│   ├── index.tsx          # Home screen (sessions list)
│   ├── upload.tsx         # Upload/create session screen
│   └── details.tsx        # Session details & OTP management
├── store/
│   └── sessionStore.ts    # Zustand store for session state
├── package.json           # Dependencies
├── app.json              # Expo config
└── tsconfig.json         # TypeScript config
```

## Usage

### 1. Upload a Session

1. Tap **+ Upload** on the home screen
2. Enter session details:
   - **Session Name** - A friendly name for this session
   - **Phone Number** - The Telegram account phone number
   - **App ID** - From your credentials.json
   - **API Hash** - From your credentials.json
   - **2FA** - Check if account has 2FA enabled
3. Tap **Create Session**

### 2. View Session Details

1. Tap on any session card to open details
2. See full session info (App ID, API Hash, creation date)

### 3. Manage OTP Codes

1. Open a session's details
2. Paste OTP code in the input field
3. Tap **+ Add OTP Code**
4. OTP codes are stored and displayed as a list

### 4. Clone a Session

From home screen:
- Tap the **Clone** button on any session card

From details screen:
- Tap the **Clone** button

### 5. Terminate Sessions

**Kill one session:**
- Tap the **Kill** button on any session card or in details

**Auto-kill 24h+ old sessions:**
- Tap **Auto Kill 24h+** on the home screen
- Automatically runs every hour in the background

## Session Lifecycle

- **Active** - Session is usable and can be cloned
- **Inactive** - Session exists but not actively used
- **Terminated** - Session is marked for deletion
  - Auto-cleanup runs every 24 hours
  - Auto-cleanup checks every hour in background

## Data Structure

```json
{
  "id": "session_1234567890",
  "name": "My Account",
  "phoneNumber": "+1234567890",
  "appId": "123456",
  "apiHash": "abcdef1234567890",
  "has2FA": true,
  "createdAt": 1698765432000,
  "status": "active",
  "otpCodes": ["123456", "654321"]
}
```

## Development

### Building for Production

```bash
# Create a production build for Android
eas build --platform android

# Create for both platforms
eas build --platform all
```

### Testing

```bash
npm test
```

## Notes

- Session data is stored locally on your device using Zustand
- OTP codes are stored in plaintext - use this app only in secure environments
- Sessions marked as "terminated" are kept for 24 hours before auto-cleanup
- Auto-cleanup runs in the background every hour
- For best experience, use on Android 8+ or iOS 12+

## License

MIT
