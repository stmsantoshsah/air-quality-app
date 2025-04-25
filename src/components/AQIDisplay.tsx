// src/components/AQIDisplay.tsx
import React from 'react';
import { Card, Statistic, Tag, Typography, Row, Col } from 'antd';
import { AQIData, AQIDetails } from '@/lib/types';
import { getAQIDetails} from '@/lib/utils'; // Ensure AQIDetails is imported

const { Text } = Typography;

interface AQIDisplayProps {
  data: AQIData;
}

const AQIDisplay: React.FC<AQIDisplayProps> = ({ data }) => {
  let aqiDetails: AQIDetails;
  let displayAqiValue: number | string = 'N/A';

  if (typeof data.aqi === 'number' && !isNaN(data.aqi)) {
      aqiDetails = getAQIDetails(data.aqi);
      displayAqiValue = data.aqi;
  } else {
      console.warn("AQIDisplay: Invalid or missing AQI value in data:", data);
      aqiDetails = { level: 'Unknown', color: 'default', advice: 'AQI value is unavailable.' };
  }

  return (
    <Card
      title="Air Quality Index (AQI)"
      variant="borderless" // Changed from bordered={false}
    >
       <Row justify="center" align="middle" gutter={[16, 16]}>
            <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
                 <Statistic title="Current AQI Level" value={aqiDetails.level} />
                 <Tag color={aqiDetails.color} style={{ fontSize: '1.2em', padding: '5px 10px', marginTop: '10px' }}>
                    {aqiDetails.level} (Index: {displayAqiValue})
                 </Tag>
            </Col>
             <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
                <Text type="secondary">Based on OpenWeatherMap AQI scale (1-5)</Text>
                 <br/>
                 <Text strong>Location:</Text> <Text>{data.cityName || 'Current Location'}</Text>
             </Col>
        </Row>
    </Card>
  );
};

export default AQIDisplay;