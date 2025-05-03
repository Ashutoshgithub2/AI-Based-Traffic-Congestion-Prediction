import React from 'react';
import { motion } from 'framer-motion';
import { RouteAlternative } from '../types';
import { Clock, Route, ArrowRight, Navigation } from 'lucide-react';
import { getCongestionColor } from '../utils/mapUtils';

interface RouteAlternativesProps {
  alternatives: RouteAlternative[];
  onSelectRoute: (route: RouteAlternative) => void;
  selectedRouteId?: string;
  onStartNavigation: () => void;
  className?: string;
}

const RouteAlternatives: React.FC<RouteAlternativesProps> = ({
  alternatives,
  onSelectRoute,
  selectedRouteId,
  onStartNavigation,
  className = ''
}) => {
  if (!alternatives.length) {
    return null;
  }

  const handleNavigateClick = () => {
    onSelectRoute(alternatives[0]);
    onStartNavigation();
  };

  return (
    <div className={`bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Alternative Routes</h2>
      
      <div className="space-y-3">
        {alternatives.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedRouteId === route.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelectRoute(route)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Route className="h-4 w-4 text-blue-500 mr-1.5" />
                <span className="font-medium text-gray-900">{route.name}</span>
              </div>
              
              {index === 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Fastest
                </span>
              )}
              
              {route.savingsInMinutes > 0 && index > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {route.savingsInMinutes} min faster
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>{route.duration} min</span>
              <span className="mx-2">•</span>
              <span>{route.distance} km</span>
            </div>
            
            <div className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: getCongestionColor(route.congestionLevel) }}
              />
              <span className="text-xs text-gray-500 uppercase">
                {route.congestionLevel} traffic
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {alternatives.length > 0 && (
        <button
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          onClick={handleNavigateClick}
        >
          <Navigation className="h-4 w-4" />
          <span>Navigate to fastest route</span>
        </button>
      )}
    </div>
  );
};

export default RouteAlternatives;