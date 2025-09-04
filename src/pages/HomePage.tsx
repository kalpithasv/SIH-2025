import React from 'react';
import { Overview } from '../components/dashboard/Overview';
import { mockDashboardStats } from '../data/mockData';

export const HomePage: React.FC = () => {
  return (
    <Overview
      stats={mockDashboardStats}
      onDepartmentSelect={() => {}}
    />
  );
};
