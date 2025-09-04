import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'safe':
      return 'text-success-600 bg-success-100';
    case 'warning':
      return 'text-warning-600 bg-warning-100';
    case 'danger':
      return 'text-danger-600 bg-danger-100';
    case 'missing':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low':
      return 'text-success-600 bg-success-100';
    case 'medium':
      return 'text-warning-600 bg-warning-100';
    case 'high':
      return 'text-danger-600 bg-danger-100';
    case 'critical':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function calculateSafetyScore(locations: any[]): number {
  if (locations.length === 0) return 0;
  
  const totalScore = locations.reduce((sum, location) => {
    let score = 100;
    
    // Reduce score based on risk level
    switch (location.riskLevel) {
      case 'high':
        score -= 40;
        break;
      case 'medium':
        score -= 20;
        break;
      case 'low':
        score -= 5;
        break;
    }
    
    return sum + Math.max(0, score);
  }, 0);
  
  return Math.round(totalScore / locations.length);
}

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
