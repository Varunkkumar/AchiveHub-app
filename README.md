# AchiveHub v1.0.0- Achievement Tracking & Productivity App

![icon](https://github.com/user-attachments/assets/72b42d8e-c3fb-4843-8c8e-b8b06bc45dc9)
 

AchieveHub is a comprehensive mobile application designed to help users track their habits, manage tasks, and celebrate achievements. Built with React Native and Expo, it provides a seamless experience across iOS, Android, and web platforms.

## ✨ Key Features

###  Achievement Tracking
- Create and categorize achievements (Awards, Personal Goals, etc.)
- Pin important achievements
- Social features (likes and comments)
- Timeline view of accomplishments

###  Task Management
- Priority-based task organization (High/Medium/Low)
- Due date tracking
- Progress visualization
- Today's tasks overview

###  Habit Formation
- Daily/Weekly habit tracking
- Streak counter
- Visual progress calendar
- Habit completion statistics

###  User Experience
- Clean, intuitive interface
- Light/Dark theme support
- Personalized settings (week start day, reminders)
- Achievement feed with social interactions

 Want to see the upcoming v2 of app in action? Check out our [ScreenShots.md](ScreenShots.md) for demo videos and screenshots!

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
  (or)
  npx expo start --tunnel
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
