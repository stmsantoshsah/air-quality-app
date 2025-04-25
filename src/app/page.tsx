// src/app/page.tsx
import React from 'react';
import AirQualityClient from '@/components/AirQualityClient'; // Import the client component

// This can now remain a Server Component (or be rendered server-side initially)
export default function HomePage() {
  return (
    <AirQualityClient /> // Render the component that contains all the client logic
  );
}