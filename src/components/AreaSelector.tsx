'use client';
import { useState, useMemo } from 'react';
import { regionData, codeToText } from 'element-china-area-data';

const selectStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  fontSize: '14px',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  flex: 1,
  boxSizing: 'border-box',
};

interface AreaSelectorProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function AreaSelector({ value, onChange }: AreaSelectorProps) {
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const provinces = regionData;

  const cities = useMemo(() => {
    if (!province) return [];
    const provinceItem = provinces.find((p: any) => p.value === province);
    return provinceItem?.children || [];
  }, [province, provinces]);

  const districts = useMemo(() => {
    if (!city) return [];
    const cityItem = cities.find((c: any) => c.value === city);
    return cityItem?.children || [];
  }, [city, cities]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setProvince(val);
    setCity('');
    setDistrict('');
    onChange(codeToText[val] || '');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCity(val);
    setDistrict('');
    const provName = codeToText[province] || '';
    const cityName = codeToText[val] || '';
    onChange(`${provName}·${cityName}`);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDistrict(val);
    const provName = codeToText[province] || '';
    const cityName = codeToText[city] || '';
    const distName = codeToText[val] || '';
    onChange(`${provName}·${cityName}·${distName}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <select value={province} onChange={handleProvinceChange} style={selectStyle}>
        <option value="">省/直辖市</option>
        {provinces.map((p: any) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {province && (
        <select value={city} onChange={handleCityChange} style={selectStyle}>
          <option value="">市/区</option>
          {cities.map((c: any) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      )}

      {city && (
        <select value={district} onChange={handleDistrictChange} style={selectStyle}>
          <option value="">区/县</option>
          {districts.map((d: any) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}