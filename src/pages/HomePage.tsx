import React from 'react';
import { Overview } from '../components/dashboard/Overview';
import { mockDashboardStats } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleDepartmentSelect = (department: string) => {
    navigate(`/dashboard/department/${department}`);
  };

  return (
    <Overview
      stats={mockDashboardStats}
      onDepartmentSelect={handleDepartmentSelect}
    />
  );
};
