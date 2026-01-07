# JSON3D - 3D JSON Viewer

A mobile-first 3D JSON visualization app built with React Native, Expo, and Three.js.

## Features

- **3D Radial Layout**: Visualize JSON data in a radial 3D structure
- **Mobile-Optimized**: Touch controls for orbit and zoom
- **Color-Coded**: Different colors for objects, arrays, strings, numbers, and booleans
- **Cross-Platform**: Works on iOS, Android, and Web

## Getting Started

### Prerequisites

- Node.js installed
- Expo CLI (or use `npx expo`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` or scan QR code with Expo Go app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` to open in browser

## Controls

- **Touch & Drag**: Orbit around the 3D scene
- **Pinch**: Zoom in/out

## Project Structure

- `App.js` - Main app component
- `JSON3DViewer.js` - 3D visualization component
- `InfoPanel.js` - Legend and instructions overlay

## Next Steps

- Add text labels to nodes (requires font loading setup)
- Add editing capabilities
- Support for loading JSON files
- Export functionality

## Notes

- Text rendering is currently disabled (will be added with proper font loading)
- The app uses `expo-gl` for WebGL rendering
- Gesture handling uses `react-native-gesture-handler`
