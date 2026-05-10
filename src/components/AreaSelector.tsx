'use client';
import { useState, useMemo } from 'react';
import { getData } from 'china-area-data';

// 这里定义下拉框的通用样式，和项目保持一致
const selectStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--input-border)',
  borderRadius: '8px',
  fontSize: '14px',
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  flex: 1,
};

interface AreaSelectorProps {
  value: string; // 当前选中的完整地区字符串，如 "北京·市辖区·朝阳区"
  onChange: (newValue: string) => void; // 当地区变化时，调用的函数
}

export default function AreaSelector({ value, onChange }: AreaSelectorProps) {
  const data = getData(); // 获取所有数据
  const provinceData = useMemo(() => data['86'] || {}, [data]); // 获取所有省份

  // 初始化状态：如果传入了value，就解析出省、市、区的编号
  const [provinceCode, setProvinceCode] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');

  // 省列表
  const provinces = useMemo(() => Object.entries(provinceData).map(([code, name]) => ({
    code,
    name
  })), [provinceData]);

  // 市列表：当选中省后，根据省编号获取
  const cities = useMemo(() => {
    if (!provinceCode) return [];
    const cityData = data[provinceCode] || {};
    return Object.entries(cityData).map(([code, name]) => ({ code, name }));
  }, [provinceCode, data]);

  // 区县列表：当选中市后，根据市编号获取
  const districts = useMemo(() => {
    if (!cityCode) return [];
    const districtData = data[cityCode] || {};
    return Object.entries(districtData).map(([code, name]) => ({ code, name }));
  }, [cityCode, data]);

  // 处理省份变化
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setProvinceCode(code);
    setCityCode(''); // 重置市和区县
    setDistrictCode('');
    
    // 获取省份名字
    const name = provinceData[code];
    onChange(name); // 先给个临时的值
  };

  // 处理城市变化
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCityCode(code);
    setDistrictCode(''); // 重置区县
    
    // 拼接省·市格式
    const provinceName = provinceData[provinceCode];
    const cityName = data[provinceCode][code];
    onChange(`${provinceName}·${cityName}`);
  };

  // 处理区县变化
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setDistrictCode(code);
    
    // 拼接最终的 省·市·区/县 格式
    const provinceName = provinceData[provinceCode];
    const cityName = data[provinceCode][cityCode];
    const districtName = data[cityCode][code];
    onChange(`${provinceName}·${cityName}·${districtName}`);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <select value={provinceCode} onChange={handleProvinceChange} style={selectStyle}>
        <option value="">省/直辖市</option>
        {provinces.map(p => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      {provinceCode && (
        <select value={cityCode} onChange={handleCityChange} style={selectStyle}>
          <option value="">市/区</option>
          {cities.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      )}

      {cityCode && (
        <select value={districtCode} onChange={handleDistrictChange} style={selectStyle}>
          <option value="">区/县</option>
          {districts.map(d => (
            <option key={d.code} value={d.code}>{d.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}