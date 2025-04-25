// src/components/AQIDisplay.tsx
import React from 'react';
import { Card, Statistic, Tag, Typography, Row, Col } from 'antd';
import { AQIData } from '@/lib/types';
import { getAQIDetails } from '@/lib/utils';

const { Title, Text } = Typography;

interface AQIDisplayProps {
  data: AQIData;
}

const AQIDisplay: React.FC<AQIDisplayProps> = ({ data }) => {
  const aqiDetails = getAQIDetails(data.aqi);

  return (
    <Card title="Air Quality Index (AQI)" variant="borderless">
       <Row justify="center" align="middle" gutter={[16, 16]}>
            <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
                {/* Displaying the OWM AQI value and its corresponding level */}
                 <Statistic title="Current AQI Level" value={aqiDetails.level} />
                 <Tag color={aqiDetails.color} style={{ fontSize: '1.2em', padding: '5px 10px', marginTop: '10px' }}>
                    {aqiDetails.level} (Index: {data.aqi})
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