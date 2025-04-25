// src/components/AQIStandardsTable.tsx
'use client'; // Using Ant Design Table, safe to mark as client component

import React from 'react';
import { Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

const { Title } = Typography;

// Define the structure for each row of data
interface AQIStandardDataType {
  key: React.Key;
  aqiRange: string;
  category: string;
  color: string; // Hex code for background color
  textColor?: string; // Optional text color for contrast
}

// Data based on the CPCB AQI Standard image
const aqiStandardsData: AQIStandardDataType[] = [
  { key: '1', aqiRange: '0-50',    category: 'Good',         color: '#34a853', textColor: '#fff' }, // Dark Green
  { key: '2', aqiRange: '51-100',   category: 'Satisfactory', color: '#a8e063', textColor: '#000' }, // Light Green/Lime
  { key: '3', aqiRange: '101-200',  category: 'Moderate',     color: '#fdd752', textColor: '#000' }, // Yellow
  { key: '4', aqiRange: '201-300',  category: 'Poor',         color: '#f28e2b', textColor: '#fff' }, // Orange
  { key: '5', aqiRange: '301-400',  category: 'Very Poor',    color: '#ea4335', textColor: '#fff' }, // Red
  { key: '6', aqiRange: '401-500',  category: 'Severe',       color: '#b71c1c', textColor: '#fff' }, // Maroon/Dark Red
];

// Define the columns for the Ant Design Table
const columns: TableColumnsType<AQIStandardDataType> = [
  {
    title: 'Air Quality Index (AQI)',
    dataIndex: 'aqiRange',
    key: 'aqiRange',
    align: 'center',
    render: (text: string, record: AQIStandardDataType) => (
      // Use Tag for styling the cell background and text
      <Tag
        style={{
            backgroundColor: record.color,
            color: record.textColor || '#000', // Default to black text if not specified
            padding: '5px 10px',
            fontSize: '14px',
            border: 'none',
            width: '100%', // Make tag fill the cell
            textAlign: 'center',
            display: 'block' // Ensure it behaves like a block element
         }}
        >
        {text}
      </Tag>
    ),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    align: 'center',
     render: (text: string, record: AQIStandardDataType) => (
      <Tag
        style={{
            backgroundColor: record.color,
            color: record.textColor || '#000',
            padding: '5px 10px',
            fontSize: '14px',
            border: 'none',
            width: '100%',
            textAlign: 'center',
            display: 'block'
        }}
       >
        {text}
      </Tag>
    ),
  },
];

const AQIStandardsTable: React.FC = () => {
  return (
    <div style={{ marginTop: '32px', marginBottom: '24px' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: '16px' }}>
            Air Quality Index (AQI) Categories (CPCB Standard)
        </Title>
        <Table
            columns={columns}
            dataSource={aqiStandardsData}
            pagination={false} // No need for pagination for this small table
            bordered // Add borders for clarity
            size="middle" // Adjust size if needed
            />
    </div>
  );
};

export default AQIStandardsTable;