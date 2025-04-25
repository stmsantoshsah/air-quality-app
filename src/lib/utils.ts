// src/lib/utils.ts
import { AQIDetails } from './types';

// Mapping based on standard US AQI levels (adjust if needed for other standards)
// OpenWeatherMap provides AQI 1-5, which needs mapping.
// Let's assume a direct conversion for simplicity first, then refine.
// OWM AQI: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor

export function getAQIDetails(aqi: number): AQIDetails {
  switch (aqi) {
    case 1:
      return { level: 'Good', color: 'green', advice: 'Air quality is considered satisfactory, and air pollution poses little or no risk.' };
    case 2:
      return { level: 'Fair', color: 'gold', advice: 'Air quality is acceptable; however, some pollutants may be a moderate health concern for a very small number of people unusually sensitive to air pollution.' };
    case 3:
      return { level: 'Moderate', color: 'orange', advice: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.' };
    case 4:
      return { level: 'Poor', color: 'red', advice: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.' };
    case 5:
      return { level: 'Very Poor', color: 'purple', advice: 'Health alert: everyone may experience more serious health effects. Everyone should avoid all outdoor exertion.' };
    default:
      return { level: 'Unknown', color: 'default', advice: 'AQI data is unavailable.' };
  }
}

// --- Alternative mapping if you fetch raw pollutants and calculate standard AQI ---
// This requires a more complex calculation based on pollutant concentration breakpoints.
// For this example, we'll stick to the simpler OWM 1-5 mapping.

// Example function to convert Kelvin to Celsius
export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

// Example function to get weather icon URL
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}