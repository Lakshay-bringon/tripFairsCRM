import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorClass = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  cyan: 'text-cyan-400',
};

export function StatsCard({ 
  title, 
  value, 
  trend = 'neutral', 
  trendValue, 
  icon: Icon,
  description,
  color = 'blue',
  onClick
}) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div 
      className={`px-4 py-3 rounded-xl border border-gray-700 transition-all duration-200 flex flex-col justify-between h-32
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-gray-200">{title}</div>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>

      <div className="flex-1 flex items-end">
        <div className={`text-2xl font-bold ${colorClass[color] || 'text-blue-400'}`}>{value}</div>
      </div>
      {description && (
        <div className="text-sm text-gray-400 mt-1">{description}</div>
      )}
      {(trend !== 'neutral' && trendValue) && (
        <div className={`inline-flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'} mt-1`}>
          <TrendIcon className="w-4 h-4 mr-1" />
          {trendValue}
        </div>
      )}
    </div>
  );
}