import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  gradient: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  gradient,
  onClick 
}) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group w-full text-left"
    >
      <div className="flex items-center space-x-4">
        <div className={`${gradient} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-500 font-body">{title}</div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className={`text-sm font-semibold ${
            onClick ? 'text-purple-600 group-hover:text-purple-700' : 'text-green-600'
          } font-body`}>
            {subtitle}
          </div>
        </div>
      </div>
    </Component>
  );
};

export default StatsCard;