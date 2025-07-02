# Spectacles Weather Lens
![Real-time Emotion Detection demo](spectacles.gif)

A modern, location-aware AR weather application built for Snapchat Spectacles using Lens Studio.

## Overview
This project demonstrates a seamless AR weather experience on Spectacles, integrating geolocation, reverse-geocoding, and real-time weather data to display current conditions and an hourly forecast with dynamic icons and responsive UI.

## Key Features
- **Geolocation & Reverse-Geocoding**: Retrieves device latitude/longitude and converts to human-readable place names.
- **Real-Time Weather Data**: Fetches spatiotemporal forecasts via OpenWeatherMap API.
- **Dynamic Texture2D Rendering**: Maps weather conditions to icon textures for current and hourly views.
- **Spectacles Interaction & Navigation Kits**: Implements gesture-driven navigation and polished UI components.
- **Asynchronous Data Pipeline**: Handles API requests, error states, and caching to optimize performance.
- **Responsive UI**: Ensures legibility and smooth transitions on the Spectacles display.

## Architecture
```
LocationManager (LocationService.js)
 └─ Obtains geolocation and exposes latitude/longitude
WeatherController (WeatherController.js)
 ├─ reverseGeocode(): converts lat/lon to city names via OpenCage API
 ├─ fetchWeather(): retrieves weather data from OpenWeatherMap API
 ├─ updateUI(): dynamically updates Spectacles UI with icons and text
 └─ getIconTex(): maps API icon codes to imported Texture2D assets
SpectaclesUIRoot
 └─ WeatherPanel UI hierarchy using Spectacles Interaction Kit controls
``` 

## Requirements
- **Lens Studio** v4.0 or later
- **Snap Spectacles** device or Simulator
- **API Keys**:
  - OpenWeatherMap API key
  - OpenCage (or alternative) reverse-geocoding API key

## Setup & Installation
1. **Clone this repository**:
   ```bash
   git clone https://github.com/yourusername/spectacles-weather-lens.git
   cd spectacles-weather-lens
   ```
2. **Open in Lens Studio**:
   - Launch Lens Studio and open `SpectaclesWeatherLens.lens`.
3. **Configure API Keys**:
   - In **WeatherController.js**, replace `<YOUR_OPENWEATHERMAP_API_KEY>` with your key.
   - In **WeatherController.js**, replace `<YOUR_OPENCAGE_API_KEY>` with your key.
4. **Import Icons**:
   - Add your set of PNG icons named to match OpenWeatherMap codes (e.g., `01d.png`) into the **Resources/Icons** folder.
   - Populate the `iconTextures` array in the **WeatherController** script component.

## Usage
- **Preview in Simulator**: Click **Preview → Spectacles** in Lens Studio.
- **Test on Device**: Connect Snap Spectacles via USB and scan the QR code.

## Contributing
Contributions welcome! Please fork the repo and open a pull request with your enhancements.
