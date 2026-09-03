# Getting Started

## Prerequisites
- Node.js installed
- npm (comes with Node.js)
- Expo Go app on your phone (for quick testing), install from the App Store / Play Store
- An Expo account (only needed if building an APK/iOS build later)

## 1. Clone the repo
```bash
git clone git@github.com:LiderLabs/AHCoF.git
cd repo/frontend
```

## 2. Install dependencies
```bash
npm install
```

## 3. Environment variables
Create a `.env` file in the `frontend/` folder with the API base URL (the backend endpoint is hosted, not run locally)  
Ask a team member for the current URL if you don't have it.

## 4. Run the app
```bash
npx expo start
```

This starts the Metro bundler and shows a QR code.

- **On your phone:** open the Expo Go app and scan the QR code.
- **On a simulator/emulator:** press `i` (iOS simulator) or `a` (Android emulator) in the terminal after `expo start` runs.

## 5. Building an APK (Android)
