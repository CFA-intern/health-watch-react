
import { Heart, Activity, Thermometer, Droplets } from 'lucide-react';

interface VitalCardProps {
  label: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: 'heart' | 'activity' | 'temperature' | 'droplets';
  min?: number;
  max?: number;
}

const VitalCard: React.FC<VitalCardProps> = ({ 
  label, 
  value, 
  unit, 
  status, 
  icon,
  min,
  max 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'activity': return <Activity className="h-5 w-5" />;
      case 'temperature': return <Thermometer className="h-5 w-5" />;
      case 'droplets': return <Droplets className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'normal': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <div className={getIconColor()}>
          {getIcon()}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value.toFixed(1)}</span>
        <span className="text-sm">{unit}</span>
      </div>
      
      {min !== undefined && max !== undefined && (
        <div className="text-xs mt-1 opacity-75">
          Normal: {min}-{max} {unit}
        </div>
      )}
    </div>
  );
};

export default VitalCard;
