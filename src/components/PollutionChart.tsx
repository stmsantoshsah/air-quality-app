// src/components/PollutionChart.tsx
'use client'; // This component uses browser-specific APIs

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, Typography } from 'antd';
import type { ApexOptions } from 'apexcharts'; // Import ApexOptions type
import { AQIData } from '@/lib/types'; // Assuming AQIData is defined in your types

const { Title } = Typography;

// Dynamically import ReactApexChart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Define mapping for readable pollutant names (reuse or define here)
const pollutantNames: { [key: string]: string } = {
    co: 'CO',
    // no: 'NO', // Often less critical than NO2
    no2: 'NO₂',
    o3: 'O₃',
    so2: 'SO₂',
    pm2_5: 'PM₂.₅',
    pm10: 'PM₁₀',
    // nh3: 'NH₃', // Can be included if desired
 };

interface PollutionChartProps {
  data: AQIData['components'];
}

const PollutionChart: React.FC<PollutionChartProps> = ({ data }) => {
  // Prepare data for the chart
  const chartData = Object.entries(data)
    .filter(([key]) => pollutantNames[key]) // Only include pollutants we have names for
    .map(([key, value]) => ({
      name: pollutantNames[key],
      value: parseFloat(value.toFixed(2)), // Ensure value is a number, formatted
    }));

  // ApexCharts configuration
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true, // Show toolbar for zoom, download, etc.
      },
    },
    plotOptions: {
      bar: {
        horizontal: false, // Vertical bars
        columnWidth: '55%',
        // endingShape: 'rounded', // Optional: rounded bars
         distributed: true, // Give each bar a different color from the theme palette
         dataLabels: {
             position: 'top', // Position data labels on top of bars
         },
      },
    },
    dataLabels: {
      enabled: true, // Show values on top of bars
      formatter: function (val) {
        // Ensure val is treated as a number for toFixed
        return typeof val === 'number' ? val.toFixed(1) : val;
      },
       offsetY: -20,
       style: {
         fontSize: '12px',
         colors: ["#304758"]
       }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.map(item => item.name), // Pollutant names as categories
       title: {
           text: 'Pollutants',
       },
       labels: {
         style: {
           fontSize: '12px',
         },
       },
    },
    yaxis: {
      title: {
        text: 'Concentration (µg/m³)', // Unit label
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " µg/m³"; // Tooltip showing unit
        },
      },
    },
    title: {
        text: 'Current Pollutant Concentrations',
        align: 'center',
        style: {
            fontSize: '16px',
            // color: '#263238' // Optional: Set title color
        }
    },
     // colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A'], // Optional: Define custom colors
     legend: {
         show: false // Hide legend as colors are distributed and labels are clear
     }
  };

  const series = [
    {
      name: 'Concentration', // Series name (shows in tooltip)
      data: chartData.map(item => item.value), // Pollutant values
    },
  ];

  // Ensure chart doesn't render if data is missing essential parts
  if (!chartData || chartData.length === 0) {
      return (
          <Card>
              <p>Insufficient data to display pollutant chart.</p>
          </Card>
      );
  }


  return (
    // Using Ant Design Card for consistency
    <Card variant="borderless" style={{ marginTop: '16px' }}>
        {/* Card title could be redundant if chart title is used, decide which one to keep */}
        {/* <Title level={5} style={{ textAlign: 'center', marginBottom: '16px' }}>Current Pollutant Concentrations</Title> */}
        <div id="pollution-bar-chart">
            <ReactApexChart options={options} series={series} type="bar" height={350} width="100%" />
        </div>
    </Card>
  );
};

export default PollutionChart;