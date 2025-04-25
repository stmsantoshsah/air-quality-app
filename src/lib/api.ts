// src/lib/api.ts
import { AirPollutionResponse, CurrentWeatherResponse, AQIData, WeatherData } from './types';
import { kelvinToCelsius } from './utils';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.error("Error: OpenWeatherMap API key not found. Please set NEXT_PUBLIC_OPENWEATHERMAP_API_KEY in your .env.local file.");
}

// Fetch Air Pollution Data by Coordinates
export async function fetchAirPollutionData(lat: number, lon: number): Promise<AQIData | null> {
  if (!API_KEY) return null;
  try {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    console.log(`Fetching Air Pollution Data: ${url}`); // Log URL for debugging
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const data: AirPollutionResponse = await response.json();
    console.log('Air Pollution API Response:', data); // Log response for debugging

    if (data && data.list && data.list.length > 0) {
      const currentData = data.list[0];
      return {
        aqi: currentData.main.aqi,
        components: currentData.components,
        timestamp: currentData.dt * 1000, // Convert seconds to milliseconds
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch air pollution data:", error);
    throw error; // Re-throw to be caught by the component
  }
}

// Fetch Current Weather Data by Coordinates
export async function fetchCurrentWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    if (!API_KEY) return null;
    try {
      // Use 'units=metric' to get Celsius and m/s directly
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      console.log(`Fetching Weather Data: ${url}`); // Log URL for debugging
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: CurrentWeatherResponse = await response.json();
      console.log('Weather API Response:', data); // Log response for debugging

      if (data && data.main && data.weather && data.weather.length > 0) {
          return {
              // temp: kelvinToCelsius(data.main.temp), // No longer needed with units=metric
              temp: Math.round(data.main.temp),
              description: data.weather[0].description,
              icon: data.weather[0].icon,
              humidity: data.main.humidity,
              windSpeed: data.wind.speed,
              cityName: data.name,
              country: data.sys.country,
              lat: data.coord.lat,
              lon: data.coord.lon,
          };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      throw error; // Re-throw to be caught by the component
    }
}


// Fetch Coordinates by City Name (Geocoding)
export async function fetchCoordinatesByCity(city: string): Promise<{ lat: number; lon: number; name: string; country: string; } | null> {
  if (!API_KEY) return null;
  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    console.log(`Fetching Coordinates for City: ${url}`); // Log URL for debugging
    const response = await fetch(url);
     if (!response.ok) {
       throw new Error(`API Error: ${response.status} ${response.statusText}`);
     }
    const data = await response.json();
    console.log('Geocoding API Response:', data); // Log response for debugging

    if (data && data.length > 0) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
        country: data[0].country
      };
    }
    return null; // City not found
  } catch (error) {
    console.error("Failed to fetch coordinates:", error);
    throw error; // Re-throw to be caught by the component
  }
}