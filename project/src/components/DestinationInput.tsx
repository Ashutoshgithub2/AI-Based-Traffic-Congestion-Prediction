import React, { useState } from 'react';
import { MapPin, ArrowRight, X } from 'lucide-react';
import SearchBar from './SearchBar';
import { Location } from '../types';

interface DestinationInputProps {
  onRouteSelect: (origin: Location, destination: Location) => void;
  className?: string;
}

const DestinationInput: React.FC<DestinationInputProps> = ({ 
  onRouteSelect,
  className = ''
}) => {
  const [origin, setOrigin] = useState<{ location: Location; name: string } | null>(null);
  const [destination, setDestination] = useState<{ location: Location; name: string } | null>(null);
  const [isFocused, setIsFocused] = useState<'origin' | 'destination' | null>(null);

  const handleOriginSelect = (location: Location, name: string) => {
    setOrigin({ location, name });
    setIsFocused('destination');
  };

  const handleDestinationSelect = (location: Location, name: string) => {
    setDestination({ location, name });
    setIsFocused(null);
    
    if (origin) {
      onRouteSelect(origin.location, { lat: location.lat, lng: location.lng });
    }
  };

  const clearOrigin = () => {
    setOrigin(null);
  };

  const clearDestination = () => {
    setDestination(null);
  };

  const swapLocations = () => {
    if (origin && destination) {
      const tempOrigin = origin;
      setOrigin(destination);
      setDestination(tempOrigin);
      
      onRouteSelect(destination.location, origin.location);
    }
  };

  return (
    <div className={`bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Plan Your Route</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
            </div>
          </div>
          
          {origin ? (
            <div 
              className="pl-10 pr-8 py-3 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer"
              onClick={() => setIsFocused('origin')}
            >
              <p className="text-sm text-gray-500">From</p>
              <p className="font-medium text-gray-900">{origin.name}</p>
              
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  clearOrigin();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className={`pl-10 border rounded-lg transition-all ${
                isFocused === 'origin' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <SearchBar 
                onLocationSelect={handleOriginSelect} 
              />
            </div>
          )}
        </div>
        
        {/* Swap button */}
        {origin && destination && (
          <div className="flex justify-center">
            <button
              onClick={swapLocations}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-gray-500 rotate-90" />
            </button>
          </div>
        )}
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-red-600" />
            </div>
          </div>
          
          {destination ? (
            <div 
              className="pl-10 pr-8 py-3 bg-red-50 border border-red-100 rounded-lg cursor-pointer"
              onClick={() => setIsFocused('destination')}
            >
              <p className="text-sm text-gray-500">To</p>
              <p className="font-medium text-gray-900">{destination.name}</p>
              
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  clearDestination();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className={`pl-10 border rounded-lg transition-all ${
                isFocused === 'destination' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <SearchBar 
                onLocationSelect={handleDestinationSelect} 
              />
            </div>
          )}
        </div>
      </div>
      
      {origin && destination && (
        <button
          onClick={() => onRouteSelect(origin.location, destination.location)}
          className="mt-4 w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <span>Get Directions</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default DestinationInput;