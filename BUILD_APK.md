# 🔨 Build APK Guide

Your Telegram Session Manager mobile app is ready! Here are the **easiest ways** to build and install the APK on your Android phone.

## 📱 Option 1: EAS Build (Recommended - Fastest)

EAS Build is Expo's cloud builder - builds in the cloud, you just download the APK.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
(Create free account at https://expo.dev if you don't have one)

### Step 3: Configure EAS
```bash
cd /home/user/freevps63
eas build:configure
```

### Step 4: Build APK
```bash
eas build --platform android --profile preview
```

**This will:**
- Build your app in the cloud
- Give you a download link to the APK
- Takes ~10-15 minutes
- Download and install on your phone ✅

---

## 🛠️ Option 2: Build Locally (Advanced)

If you want to build on your computer.

### Prerequisites
- Android SDK installed
- Java 11+ installed
- gradle (usually comes with Android SDK)

### Build
```bash
cd /home/user/freevps63
npm install
expo prebuild --clean
expo run android
```

---

## 📦 Option 3: Expo Go (Instant Testing - No APK)

Don't want to wait for APK build? Test the app instantly:

### Step 1: Install Expo Go
Download "Expo Go" app on your phone from Play Store

### Step 2: Start Dev Server
```bash
cd /home/user/freevps63
npm install
npm start
```

### Step 3: Scan QR Code
- In terminal, you'll see a QR code
- Open Expo Go app on your phone
- Scan the QR code
- App opens instantly! 🎉

---

## ✅ App Features Included

Your APK will have:

### 📱 Sessions Tab
- ✅ Add/import Telegram sessions
- ✅ View all sessions with details
- ✅ Clone sessions
- ✅ Kill individual sessions
- ✅ Auto-kill sessions older than 24 hours
- ✅ Track OTP codes per session

### 🛠️ Tools Tab  
- ✅ Check Spam (spam detection)
- ✅ Read Codes (view all OTP codes)
- ✅ 2FA Manager (manage 2FA settings)
- ✅ Send Message (send messages from sessions)
- ✅ Kill Sessions (batch kill)
- ✅ Validate (validate accounts)
- ✅ Account Info (user details)
- ✅ Account Clean (cleanup inactive)

### 📊 Stats Tab
- ✅ Total sessions count
- ✅ Active/Inactive/Terminated breakdown
- ✅ OTP codes count
- ✅ 2FA enabled count

---

## 🚀 Quick Start (Testing Immediately)

If you just want to test NOW without building APK:

```bash
# Install dependencies
cd /home/user/freevps63
npm install

# Start app
npm start

# On your phone:
# 1. Download "Expo Go" from Play Store
# 2. Scan the QR code shown in terminal
# 3. App opens on your phone instantly
```

---

## 📥 Install on Phone

Once you have the APK file:

1. Download APK to your phone
2. Open file manager
3. Tap the APK file
4. Tap "Install"
5. App installs ✅
6. Open app and start managing sessions!

---

## 🐛 Troubleshooting

**"EAS CLI not found"**
```bash
npm install -g eas-cli@latest
```

**"Expo Go won't scan QR"**
- Make sure phone and computer are on same WiFi
- Try scanning again or copy the URL from terminal

**"APK build fails"**
```bash
# Clear cache and rebuild
cd /home/user/freevps63
rm -rf .expo node_modules
npm install
eas build --platform android --profile preview --clean
```

**"Can't install APK on phone"**
- Go to phone Settings → Apps & notifications → Special app access
- Enable "Install unknown apps" for your file manager
- Then try installing APK again

---

## 📝 After Installation

Once app is on your phone:

1. **Add Sessions** - Tap "+ Add" button, enter session details
2. **Clone Sessions** - Tap "Clone" on any session
3. **View OTP** - Open session details, add OTP codes
4. **Kill Sessions** - Tap "Kill" button or use auto-kill feature
5. **Check Tools** - Use Tools tab for spam check, 2FA, etc

---

## 🎯 Which Option to Pick?

| Option | Time | Cost | Ease | Result |
|--------|------|------|------|--------|
| **EAS Build** | 15 min | Free | ⭐⭐⭐⭐⭐ | APK file |
| **Local Build** | 30 min | Free | ⭐⭐⭐ | APK file |
| **Expo Go** | 1 min | Free | ⭐⭐⭐⭐⭐ | Live app |

**RECOMMENDED:** Start with **Expo Go** for instant testing, then use **EAS Build** for production APK.

---

Enjoy your Telegram Session Manager! 🚀
