// src/components/HealthAdvisory.tsx
import React from 'react';
import { Alert } from 'antd';
import { AQIData, AQIDetails } from '@/lib/types';
import { getAQIDetails} from '@/lib/utils'; // Ensure AQIDetails is imported

interface HealthAdvisoryProps {
  aqiData: AQIData;
}

const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({ aqiData }) => {
  // --- Defensive Check ---
  let aqiDetails: AQIDetails;

  if (typeof aqiData.aqi === 'number' && !isNaN(aqiData.aqi)) {
    // Only call if aqiData.aqi is a valid number
    aqiDetails = getAQIDetails(aqiData.aqi);
  } else {
    // Handle invalid or missing AQI value
    console.warn("HealthAdvisory: Invalid or missing AQI value in data:", aqiData);
    // Provide default details
    aqiDetails = { level: 'Unknown', color: 'default', advice: 'Health advice unavailable due to missing AQI data.' };
    // Alternatively, you could return null here to render nothing:
    // return null;
  }
  // --- End Check ---


  // Determine Alert type based on AQI level for visual cue
  let alertType: "success" | "info" | "warning" | "error" = "info"; // Default to info for Unknown
  if (aqiDetails.level === "Good") alertType = "success";
  else if (aqiDetails.level === "Fair") alertType = "warning"; // Changed Fair to warning as per original mapping
  else if (aqiDetails.level === "Moderate") alertType = "warning";
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