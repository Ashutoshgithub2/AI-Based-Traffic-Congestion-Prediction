import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { geocodeAddress } from '../utils/mapUtils';
import { Location } from '../types';

interface SearchBarProps {
  onLocationSelect: (location: Location, name: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<{ name: string; location: Location }[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const location = await geocodeAddress(searchQuery);
      
      if (location) {
        onLocationSelect(location, searchQuery);
        
        // Add to recent searches
        const newSearch = { name: searchQuery, location };
        setRecentSearches(prev => 
          [newSearch, ...prev.filter(s => s.name !== searchQuery)].slice(0, 5)
        );
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };
  
  const handleUseCurrentLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          };
          onLocationSelect(location, 'Current Location');
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    } catch (error) {
      console.error('Current location error:', error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
          className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-white/80 backdrop-blur-md 
                    border border-gray-200 shadow-sm focus:outline-none focus:ring-2 
                    focus:ring-blue-500 transition-all"
        />
        <Search className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
        
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="absolute right-3 top-3.5 text-blue-500 hover:text-blue-700"
          title="Use current location"
        >
          <MapPin className="h-5 w-5" />
        </button>
      </form>
      
      {isSearching && (
        <div className="mt-2 text-sm text-gray-500">Searching...</div>
      )}
      
      {recentSearches.length > 0 && (
        <div className="mt-2">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item, index) => (
              <button
                key={index}
                onClick={() => onLocationSelect(item.location, item.name)}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 
                         transition-colors flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;