// src/lib/types.ts

// OpenWeatherMap Air Pollution API Response Structure (Simplified)
export interface AirPollutionResponse {
  coord: {
    lon: number;
    lat: number;
  };
  list: [
    {
      main: {
        aqi: number; // Air Quality Index (1-5)
      };
      components: {
        co: number;    // Carbon monoxide μg/m³
        no: number;    // Nitrogen monoxide μg/m³
        no2: number;   // Nitrogen dioxide μg/m³
        o3: number;    // Ozone μg/m³
        so2: number;   // Sulphur dioxide μg/m³
        pm2_5: number; // Fine particles matter μg/m³
        pm10: number;  // Coarse particulate matter μg/m³
        nh3: number;   // Ammonia μg/m³
      };
      dt: number; // Timestamp
    }
  ];
}

// OpenWeatherMap Current Weather API Response Structure (Simplified)
export interface CurrentWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string; // e.g., Clouds
      description: string; // e.g., broken clouds
      icon: string; // Weather icon id
    }
  ];
  main: {
    temp: number;       // Temperature (Kelvin default)
    feels_like: number;
    pressure: number;
    humidity: number;   // %
    temp_min: number;
    temp_max: number;
  };
  visibility: number;
  wind: {
    speed: number;    // Meter/sec default
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number; // Cloudiness %
  };
  dt: number; // Timestamp
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string; // City name
  cod: number;
}

// Internal Data Structure for our App
export interface AQIData {
  aqi?: number;
  components: AirPollutionResponse['list'][0]['components'];
  timestamp: number;
  cityName?: string; // Add city name if available from weather data
  locationName?: string | undefined
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
  country: string;
  lat: number;
  lon: number;
}

// AQI Level Details
export interface AQIDetails {
  level: string;
  color: string; // Ant Design color name or hex code
  textColor?: string; // Optional text color for better contrast on tags
  advice: string;
}