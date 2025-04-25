// src/providers/ThemeProvider.tsx
'use client'; // ConfigProvider often works best in a client component context

import React from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';

// Define your theme configuration here
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1DA57A', // Example: A shade of green
    borderRadius: 6,
    // Add other theme tokens as needed
    // colorBgContainer: '#f6ffed', // Example background color
  },
  components: {
    // Customize specific components
    Button: {
       // colorPrimary: '#ff4d4f', // Example: Make primary buttons red
       // algorithm: true, // Enable algorithm for theme derivation
    },
    Card: {
      // Example: Customize card header color
      // colorBgContainer: '#ffffff', // Ensure card background is distinct if needed
      // headerBg: '#e6f7ff',
    }
  },
};

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};

export default CustomThemeProvider;