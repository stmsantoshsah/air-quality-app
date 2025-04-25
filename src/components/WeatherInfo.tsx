// src/components/WeatherInfo.tsx
import React from 'react';
import { Card, Descriptions, Image, Row, Col, Typography } from 'antd';
import { WeatherData } from '@/lib/types';
import { getWeatherIconUrl } from '@/lib/utils';

const { Text } = Typography;

interface WeatherInfoProps {
  data: WeatherData;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data }) => {
  return (
    <Card title={`Current Weather in ${data.cityName}, ${data.country}`} variant="borderless">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Image
                width={80}
                src={getWeatherIconUrl(data.icon)}
                alt={data.description}
                preview={false}
             />
            <Text style={{ display: 'block', textTransform: 'capitalize' }}>{data.description}</Text>
        </Col>
        <Col xs={24} sm={16}>
             <Descriptions   column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="Temperature">{data.temp}°C</Descriptions.Item>
                <Descriptions.Item label="Humidity">{data.humidity}%</Descriptions.Item>
                <Descriptions.Item label="Wind Speed">{data.windSpeed} m/s</Descriptions.Item>
                <Descriptions.Item label="Location">{`${data.lat.toFixed(2)}, ${data.lon.toFixed(2)}`}</Descriptions.Item>
            </Descriptions>
        </Col>
       </Row>
    </Card>
  );
};

export default WeatherInfo;