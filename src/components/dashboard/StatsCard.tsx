import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'text-primary-600 bg-primary-100',
    green: 'text-success-600 bg-success-100',
    red: 'text-danger-600 bg-danger-100',
    yellow: 'text-warning-600 bg-warning-100',
    purple: 'text-purple-600 bg-purple-100'
  };

  const changeColorClasses = {
    positive: 'text-success-600',
    negative: 'text-danger-600',
    neutral: 'text-gray-600'
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-start sm:items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={`text-xs sm:text-sm mt-1 ${changeColorClasses[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${colorClasses[color]}`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
