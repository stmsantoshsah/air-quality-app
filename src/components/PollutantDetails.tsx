// src/components/PollutantDetails.tsx
import React from 'react';
import { Card, List, Typography, Row, Col } from 'antd';
import { AQIData } from '@/lib/types';

const { Text } = Typography;

interface PollutantDetailsProps {
  data: AQIData['components'];
}

// Define units for better readability
const pollutantUnits: { [key: string]: string } = {
  co: 'μg/m³',
  no: 'μg/m³',
  no2: 'μg/m³',
  o3: 'μg/m³',
  so2: 'μg/m³',
  pm2_5: 'μg/m³',
  pm10: 'μg/m³',
  nh3: 'μg/m³',
};

// Define full names
 const pollutantNames: { [key: string]: string } = {
    co: 'Carbon Monoxide',
    no: 'Nitrogen Monoxide',
    no2: 'Nitrogen Dioxide',
    o3: 'Ozone',
    so2: 'Sulphur Dioxide',
    pm2_5: 'Fine Particles (PM2.5)',
    pm10: 'Coarse Particles (PM10)',
    nh3: 'Ammonia',
 };

const PollutantDetails: React.FC<PollutantDetailsProps> = ({ data }) => {
  const pollutants = Object.entries(data)
    .filter(([key]) => pollutantNames[key]) // Only show known pollutants
    .map(([key, value]) => ({
      name: pollutantNames[key],
      value: value.toFixed(2), // Format value
      unit: pollutantUnits[key],
      key: key,
    }));

  return (
    <Card title="Pollutant Details" variant="borderless">
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={pollutants}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={{ textAlign: 'center' }}>
                <Text strong>{item.name}</Text><br/>
                <Text style={{fontSize: '1.5em'}}>{item.value}</Text>
                <Text type="secondary"> {item.unit}</Text>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default PollutantDetails;