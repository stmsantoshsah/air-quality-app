// src/components/AirQualityClient.tsx
'use client';

import React, { useState, useCallback } from 'react'; // Removed useEffect as it wasn't used
import { Row, Col, Spin, Alert, Typography, Empty } from 'antd';
import dynamic from 'next/dynamic';

// Import Child Components
import SearchBar from '@/components/SearchBar';
import AQIDisplay from '@/components/AQIDisplay';
import WeatherInfo from '@/components/WeatherInfo';
import PollutantDetails from '@/components/PollutantDetails';
import HealthAdvisory from '@/components/HealthAdvisory';
import AQIStandardsTable from '@/components/AQIStandardsTable';

// Import API functions and Types
import {
  fetchAirPollutionData,
  fetchCurrentWeatherData,
  fetchCoordinatesByCity,
} from '@/lib/api';
import { AQIData, WeatherData } from '@/lib/types';

// Dynamically import the PollutionChart component
const DynamicPollutionChart = dynamic(
  () => import('@/components/PollutionChart'),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
        <Spin tip="Loading Chart..." />
      </div>
    ),
  }
);

export default function AirQualityClient() {
  const [loading, setLoading] = useState<boolean>(false);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocationName, setCurrentLocationName] = useState<string>('');

  const fetchData = useCallback(async (lat: number, lon: number, locationName?: string) => {
    setLoading(true);
    setError(null);
    setGeoError(null);
    setAqiData(null);
    setWeatherData(null);
    setCurrentLocationName(locationName || 'Fetching location...');

    try {
      const [aqiResult, weatherResult] = await Promise.allSettled([
        fetchAirPollutionData(lat, lon),
        fetchCurrentWeatherData(lat, lon)
      ]);

      let finalAqiData: AQIData | null = null;
      let finalWeatherData: WeatherData | null = null;
      let fetchError: string | null = null;

      // Process AQI Result
      if (aqiResult.status === 'fulfilled') {
        if (aqiResult.value !== null) {
          finalAqiData = aqiResult.value;
        } else {
          console.log("AQI fetch successful but returned no data.");
        }
      } else {
        console.error("AQI Fetch Error:", aqiResult.reason);
        fetchError = (fetchError ? fetchError + '\n' : '') + 'Failed to fetch air quality data.';
      }

      // Process Weather Result
      if (weatherResult.status === 'fulfilled') {
        if (weatherResult.value !== null) {
          finalWeatherData = weatherResult.value;
          setCurrentLocationName(`${finalWeatherData.cityName}, ${finalWeatherData.country}`);
          if (finalAqiData) {
            finalAqiData.cityName = finalWeatherData.cityName;
          }
        } else {
          console.log("Weather fetch successful but returned no data.");
          // Fix: Check currentLocationName state here
          if (finalAqiData && !currentLocationName.startsWith('Fetching')) {
             // Keep potentially existing name if weather failed
          } else {
             setCurrentLocationName(locationName || 'Location name unavailable');
          }
        }
      } else {
        console.error("Weather Fetch Error:", weatherResult.reason);
        fetchError = (fetchError ? fetchError + '\n' : '') + 'Failed to fetch weather data.';
        // Fix: Check currentLocationName state here
        if (!currentLocationName.startsWith('Fetching')) {
             // Keep potentially existing name if weather failed
        } else {
             setCurrentLocationName(locationName || 'Location name unavailable');
        }
      }

      setAqiData(finalAqiData);
      setWeatherData(finalWeatherData);

      if (fetchError) {
        setError(fetchError);
      } else if (!finalAqiData && !finalWeatherData) {
        setError("No data available for this location.");
        setCurrentLocationName('');
      }

    } catch (err: unknown) { // Fix 1: Use unknown instead of any
      console.error("Unexpected error during data fetching:", err);
      // Fix 1: Type check before accessing message
      let message = 'An unexpected error occurred.';
      if (err instanceof Error) {
          message = err.message;
      }
      setError(message);
      setAqiData(null);
      setWeatherData(null);
      setCurrentLocationName('');
    } finally {
      setLoading(false);
    }
    // Fix 2: Add missing dependency
  }, [currentLocationName]); // <-- Add currentLocationName here

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchData(latitude, longitude, 'Your Location');
        setGeoLoading(false);
      },
      (error) => {
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
        setGeoLoading(false);
      }
    );
  }, [fetchData]);

  const handleSearch = useCallback(async (city: string) => {
    try {
      const coords = await fetchCoordinatesByCity(city);
      if (coords) {
        fetchData(coords.lat, coords.lon, `${coords.name}, ${coords.country}`);
      } else {
        setError(`Could not find location data for "${city}". Please try a different city name.`);
        setCurrentLocationName('');
        setLoading(false);
      }
    } catch (err: unknown) { // Fix 3: Use unknown instead of any
      console.error("Search failed (fetching coordinates):", err);
      // Fix 3: Type check before accessing message
      let message = `An error occurred while searching for "${city}".`;
      if (err instanceof Error) {
          message = err.message;
      }
      setError(message);
      setCurrentLocationName('');
      setLoading(false);
    }
  }, [fetchData]);

  // --- Render the UI ---
  return (
    <Spin
      spinning={loading || geoLoading}
      tip={geoLoading ? 'Getting location...' : 'Loading data...'}
      size="large"
    >
      <div> {/* Explicit wrapper div */}
        <Row gutter={[16, 24]}>

          {/* Search Bar */}
          <Col span={24}>
            <SearchBar
              onSearch={handleSearch}
              onGeolocate={handleGeolocate}
              loading={loading || geoLoading}
              geoError={geoError}
            />
          </Col>

          {/* Error Display */}
          {error && (
            <Col span={24}>
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
              />
            </Col>
          )}

          {/* Data Display */}
          {!loading && !error && aqiData && weatherData ? (
            <>
              {/* AQI & Weather */}
              <Col xs={24} lg={12}>
                <AQIDisplay data={aqiData} />
              </Col>
              <Col xs={24} lg={12}>
                <WeatherInfo data={weatherData} />
              </Col>
              {/* Pollutants */}
              <Col span={24}>
                <PollutantDetails data={aqiData.components} />
              </Col>
              {/* Chart */}
              {aqiData.components && (
                <Col span={24}>
                  <DynamicPollutionChart data={aqiData.components} />
                </Col>
              )}
              {/* Advisory */}
              <Col span={24}>
                <HealthAdvisory aqiData={aqiData} />
              </Col>
            </>
          ) : !loading && !error && !aqiData && !weatherData && !geoError ? (
            <Col span={24} style={{ textAlign: 'center', marginTop: 40 }}>
              <Empty description={<span>Please search for a city or use your current location <br /> to check the air quality and weather.</span>} />
            </Col>
          ) : null}

          {/* Standards Table */}
          <Col span={24}>
            <AQIStandardsTable />
          </Col>

        </Row>
      </div>
    </Spin>
  );
}