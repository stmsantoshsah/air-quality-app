// src/components/AirQualityClient.tsx
'use client'; // This directive is essential for using hooks and event handlers

import React, { useState, useCallback } from 'react';
import { Row, Col, Spin, Alert, Empty } from 'antd';
import dynamic from 'next/dynamic'; // Required for dynamically importing client components

// Import Child Components
import SearchBar from '@/components/SearchBar';
import AQIDisplay from '@/components/AQIDisplay';
import WeatherInfo from '@/components/WeatherInfo';
import PollutantDetails from '@/components/PollutantDetails';
import HealthAdvisory from '@/components/HealthAdvisory';

// Import API functions and Types
import {
  fetchAirPollutionData,
  fetchCurrentWeatherData,
  fetchCoordinatesByCity,
} from '@/lib/api';
import { AQIData, WeatherData } from '@/lib/types';
import AQIStandardsTable from './AQIStandardsTable';

// Dynamically import the PollutionChart component to disable Server-Side Rendering (SSR)
// ApexCharts relies on browser APIs that are not available on the server.
const DynamicPollutionChart = dynamic(
  () => import('@/components/PollutionChart'), // Path to the chart component
  {
    ssr: false, // Disable SSR for this component
    loading: () => ( // Optional: Show a loading indicator while the chart component bundle is loaded
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
        <Spin tip="Loading Chart..." />
      </div>
    ),
  }
);

// Main client component handling state and logic for the air quality page
export default function AirQualityClient() {
  // State variables
  const [loading, setLoading] = useState<boolean>(false); // Loading state for general API calls (search/fetch)
  const [geoLoading, setGeoLoading] = useState<boolean>(false); // Separate loading state for geolocation request
  const [error, setError] = useState<string | null>(null); // Error messages from API calls or search
  const [geoError, setGeoError] = useState<string | null>(null); // Specific error messages for geolocation
  const [aqiData, setAqiData] = useState<AQIData | null>(null); // Stores fetched Air Quality Index data
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // Stores fetched Weather data
  const [currentLocationName, setCurrentLocationName] = useState<string>(''); // Stores the name of the location being displayed

  /**
   * Fetches both air pollution and weather data for given coordinates.
   * Uses Promise.allSettled to fetch concurrently and handle partial failures.
   * Updates the component's state with fetched data or errors.
   */
  const fetchData = useCallback(async (lat: number, lon: number, locationName?: string) => {
    setLoading(true); // Start main loading indicator
    setError(null); // Clear previous errors
    setGeoError(null); // Clear previous geo errors
    setAqiData(null); // Reset previous AQI data
    setWeatherData(null); // Reset previous Weather data
    setCurrentLocationName(locationName || 'Fetching location...'); // Set initial or provided location name

    try {
      // Fetch both APIs concurrently
      const [aqiResult, weatherResult] = await Promise.allSettled([
        fetchAirPollutionData(lat, lon),
        fetchCurrentWeatherData(lat, lon)
      ]);

      let finalAqiData: AQIData | null = null;
      let finalWeatherData: WeatherData | null = null;
      let fetchError: string | null = null;

      // Process Air Pollution API result
      if (aqiResult.status === 'fulfilled') {
        if (aqiResult.value !== null) {
          finalAqiData = aqiResult.value; // Assign if data is valid
        } else {
          console.log("AQI fetch successful but returned no data.");
          // Optional: Add specific message if desired
          // fetchError = (fetchError ? fetchError + '\n' : '') + 'No air quality data available.';
        }
      } else { // status === 'rejected'
        console.error("AQI Fetch Error:", aqiResult.reason);
        fetchError = (fetchError ? fetchError + '\n' : '') + 'Failed to fetch air quality data.';
      }

      // Process Current Weather API result
      if (weatherResult.status === 'fulfilled') {
        if (weatherResult.value !== null) {
          finalWeatherData = weatherResult.value;
          // Update location name state based on successful weather fetch
          setCurrentLocationName(`${finalWeatherData.cityName}, ${finalWeatherData.country}`);
          // Safely add/update cityName in AQI data *if* AQI data was successfully fetched
          if (finalAqiData) {
            finalAqiData.cityName = finalWeatherData.cityName; // Add city name for consistency
          }
        } else {
          console.log("Weather fetch successful but returned no data.");
           // If weather failed but AQI succeeded, keep the initial location name or a placeholder
           if (finalAqiData && !currentLocationName.startsWith('Fetching')) {
             // Keep the name derived from coordinates or search term if weather fails
           } else {
               setCurrentLocationName(locationName || 'Location name unavailable');
           }
           // Optional: Add specific message if desired
           // fetchError = (fetchError ? fetchError + '\n' : '') + 'No weather data available.';
        }
      } else { // status === 'rejected'
        console.error("Weather Fetch Error:", weatherResult.reason);
        fetchError = (fetchError ? fetchError + '\n' : '') + 'Failed to fetch weather data.';
         // Keep initial location name or placeholder if weather fetch fails
        if (!currentLocationName.startsWith('Fetching')) {
             // Keep the name
        } else {
             setCurrentLocationName(locationName || 'Location name unavailable');
        }
      }

      // Set state with the final processed data (can be null if fetch failed or returned null)
      setAqiData(finalAqiData);
      setWeatherData(finalWeatherData);

      // Set overall error state based on fetch results
      if (fetchError) {
        setError(fetchError);
      } else if (!finalAqiData && !finalWeatherData) {
        // If both fetches returned no data (even if technically successful calls)
        setError("No data available for this location.");
        setCurrentLocationName(''); // Clear location name if no data at all
      }

    } catch (err: any) {
      // Catch unexpected errors during the process
      console.error("Unexpected error during data fetching:", err);
      setError(err.message || 'An unexpected error occurred.');
      setAqiData(null); // Ensure state is reset on unexpected error
      setWeatherData(null);
      setCurrentLocationName('');
    } finally {
      setLoading(false); // Stop main loading indicator regardless of success or failure
    }
  }, []); // No external dependencies, so the memoized function doesn't change

  /**
   * Handles the request to use the browser's Geolocation API.
   * Calls `fetchData` on success, sets `geoError` on failure.
   */
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true); // Start geolocation-specific loading
    setGeoError(null);   // Clear previous geo errors
    setError(null);      // Clear previous main errors
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchData(latitude, longitude, 'Your Location'); // Fetch data for current coords
        // setLoading(false) is handled within fetchData
        setGeoLoading(false); // Stop geo loading on success
      },
      (error) => { // Handle geolocation errors
        console.error("Geolocation error:", error);
        let message = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied. Please enable it in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
        }
        setGeoError(message);
        setGeoLoading(false); // Stop geo loading on error
      }
    );
  }, [fetchData]); // Depends on the memoized fetchData function

  /**
   * Handles the manual city search.
   * Fetches coordinates for the city, then calls `fetchData`.
   * Sets errors if the city is not found or coordinate fetching fails.
   */
  const handleSearch = useCallback(async (city: string) => {
    // Reset states handled by fetchData start
    // setLoading(true); // Handled within fetchData
    // setError(null);
    // setGeoError(null);
    // setCurrentLocationName(`Searching for ${city}...`); // Handled within fetchData

    try {
      const coords = await fetchCoordinatesByCity(city);
      if (coords) {
        // Fetch data using coordinates and pass the proper city name from geocoding result
        fetchData(coords.lat, coords.lon, `${coords.name}, ${coords.country}`);
      } else {
        // Handle city not found by geocoding API
        setError(`Could not find location data for "${city}". Please try a different city name.`);
        setCurrentLocationName(''); // Clear location name
        setLoading(false); // Manually stop loading if coords are not found before fetchData is called
      }
    } catch (err: any) {
      // Handle errors during the coordinate fetching process
      console.error("Search failed (fetching coordinates):", err);
      setError(err.message || `An error occurred while searching for "${city}".`);
      setCurrentLocationName(''); // Clear location name on error
      setLoading(false); // Manually stop loading on coordinate fetch error
    }
    // setLoading(false) is handled by fetchData's finally block if coords *are* found and fetchData runs
  }, [fetchData]); // Depends on the memoized fetchData function

  // --- Render the UI ---
  return (
    // Main loading spinner covering the content area
    <Spin
      spinning={loading || geoLoading} // Show spinner if either general loading or geo-loading is active
      tip={geoLoading ? 'Getting location...' : 'Loading data...'}
      size="large"
    >
      {/* Ant Design Grid system for layout */}
      <Row gutter={[16, 24]}> {/* Gutters for spacing between columns and rows */}

        {/* Search Bar Component */}
        <Col span={24}>
          <SearchBar
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            loading={loading || geoLoading} // Pass combined loading state to disable inputs/buttons
            geoError={geoError} // Pass geolocation-specific error to display near the button
          />
        </Col>

        {/* Main Error Message Display */}
        {error && ( // Conditionally render the error Alert if `error` state is not null
          <Col span={24}>
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon // Show an error icon
              closable // Allow user to close the alert
              onClose={() => setError(null)} // Clear the error state when closed
            />
          </Col>
        )}

        {/* Conditional Rendering of Data Components */}
        {/* Show data only if NOT loading, NO error, AND both aqiData AND weatherData are available */}
        {!loading && !error && aqiData && weatherData ? (
          <>
            {/* Optional: Display the current location name */}
            {/*
            <Col span={24}>
                <Typography.Title level={4} style={{ textAlign: 'center', marginBottom: 16 }}>
                    Showing data for: {currentLocationName || 'Selected Location'}
                </Typography.Title>
            </Col>
            */}

            {/* AQI and Weather Info side-by-side on larger screens */}
            <Col xs={24} lg={12}> {/* Full width on extra-small, half width on large screens */}
              <AQIDisplay data={aqiData} />
            </Col>
            <Col xs={24} lg={12}>
              <WeatherInfo data={weatherData} />
            </Col>

            {/* Pollutant Details Component */}
            <Col span={24}>
              <PollutantDetails data={aqiData.components} />
            </Col>

            {/* Pollution Chart (Dynamically Imported) */}
            {/* Render the chart only if aqiData.components exists (it should if aqiData exists) */}
            {aqiData.components && (
              <Col span={24}>
                <DynamicPollutionChart data={aqiData.components} />
              </Col>
            )}

            {/* Health Advisory Component */}
            <Col span={24}>
              <HealthAdvisory aqiData={aqiData} />
            </Col>
          </>
        ) : // Show Empty state only if NOT loading, NO error, and NO data has been loaded yet (initial state)
          !loading && !error && !aqiData && !weatherData && !geoError ? (
          <Col span={24} style={{ textAlign: 'center', marginTop: 40 }}>
            <Empty
              description={ // User guidance message
                <span>
                  Please search for a city or use your current location <br />
                  to check the air quality and weather.
                </span>
              }
            />
          </Col>
        ) : null} {/* Render nothing if loading or if there's an error (error Alert handles the UI) */}
        {/* AQI Standards Table - Rendered statically below dynamic content */}
      <Col span={24}>
          <AQIStandardsTable />
      </Col>
      </Row>
    </Spin>
  );
}