// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { Input, Button, Space, Tooltip, Alert } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
  geoError?: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGeolocate, loading, geoError }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
       <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="Enter city name"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          size="large"
          prefix={<SearchOutlined />}
        />
        <Tooltip title="Search City">
            <Button type="primary" onClick={handleSearch} loading={loading} size="large" icon={<SearchOutlined />} />
        </Tooltip>
        <Tooltip title="Use My Location">
          <Button onClick={onGeolocate} loading={loading} size="large" icon={<EnvironmentOutlined />} />
        </Tooltip>
      </Space.Compact>
       {geoError && <Alert message={geoError} type="error" showIcon style={{marginTop: 8}} />}
    </Space>
  );
};

export default SearchBar;