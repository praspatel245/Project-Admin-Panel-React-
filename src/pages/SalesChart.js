import React from 'react';
import { Line } from '@ant-design/plots';

const SalesChart = ({ data }) => {
  const config = {
    data,
    xField: 'date',
    yField: 'sales',
    seriesField: 'category',
    smooth: true,
    height: 300,
  };

  return <Line {...config} />;
};

export default SalesChart;
