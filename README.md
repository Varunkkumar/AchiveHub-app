# AchiveApp 

A mobile application built with React Native and Expo for tracking habits, tasks, and Share achievements.

## Features
- Habit tracking with progress visualization
- Task management
- Achievement system
- User profile management
- Native mobile experience with Expo

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Expo Go app (for testing on mobile)

## Installation
1. Install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/your-username/achiveapp.git
   cd achiveapp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Running the App
- Scan the QR code with Expo Go app (iOS/Android)
- Or run on web:
  ```bash
  npm run start-web
  ```

## Key Dependencies
- Expo SDK 52
- Expo Router
- React Native
- Zustand (state management)
- NativeWind (styling)
- React Navigation

## Project Structure
```
achiveapp/
├── app/               # App screens and routes
├── components/        # Reusable components
├── store/             # State management
├── utils/             # Utility functions
├── assets/            # Static assets
└── package.json       # Project dependencies
```

## License
[MIT](LICENSE)
