// src/components/HealthAdvisory.tsx
import React from 'react';
import { Alert } from 'antd';
import { AQIData } from '@/lib/types';
import { getAQIDetails } from '@/lib/utils';

interface HealthAdvisoryProps {
  aqiData: AQIData;
}

const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({ aqiData }) => {
  const aqiDetails = getAQIDetails(aqiData.aqi);

  // Determine Alert type based on AQI level for visual cue
  let alertType: "success" | "info" | "warning" | "error" = "info";
  if (aqiDetails.level === "Good") alertType = "success";
  else if (aqiDetails.level === "Fair" || aqiDetails.level === "Moderate") alertType = "warning";
  else if (aqiDetails.level === "Poor" || aqiDetails.level === "Very Poor") alertType = "error";


  return (
    <Alert
      message={`Health Advisory: ${aqiDetails.level}`}
      description={aqiDetails.advice}
      type={alertType}
      showIcon
      style={{ marginTop: 16 }}
    />
  );
};

export default HealthAdvisory;