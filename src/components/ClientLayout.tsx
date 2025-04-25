// src/components/ClientLayout.tsx
'use client';

import React from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001529' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          ☁️ Air Quality & Weather Tracker
        </Title>
      </Header>
      <Content style={{ padding: '24px 48px', flexGrow: 1 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, minHeight: 'calc(100vh - 180px)' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
        Air Quality App ©{new Date().getFullYear()} - Data provided by OpenWeatherMap
      </Footer>
    </Layout>
  );
}
