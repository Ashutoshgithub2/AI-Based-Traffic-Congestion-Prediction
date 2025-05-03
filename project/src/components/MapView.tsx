import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';
import { Location, MapOptions } from '../types';
import { Loader } from 'lucide-react';

interface MapViewProps {
  center?: Location;
  zoom?: number;
  directions?: google.maps.DirectionsResult | null;
  onMapLoad?: (map: google.maps.Map) => void;
  onMapClick?: (location: Location) => void;
  showTraffic?: boolean;
  className?: string;
}

// Default map options
const defaultOptions: MapOptions = {
  zoom: 12,
  center: { lat: 40.7128, lng: -74.0060 }, // New York City
  mapTypeId: 'roadmap',
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapView: React.FC<MapViewProps> = ({
  center,
  zoom,
  directions,
  onMapLoad,
  onMapClick,
  showTraffic = true,
  className = ''
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
    if (onMapLoad) onMapLoad(map);
  }, [onMapLoad]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !onMapClick) return;
    
    const clickedLocation: Location = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    
    onMapClick(clickedLocation);
  }, [onMapClick]);

  // Update center when prop changes
  useEffect(() => {
    if (mapReady && mapRef.current && center) {
      mapRef.current.panTo(center);
    }
  }, [center, mapReady]);

  // Update zoom when prop changes
  useEffect(() => {
    if (mapReady && mapRef.current && zoom) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom, mapReady]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-semibold">Error loading Google Maps</p>
          <p className="text-sm mt-2">Please check your API key and internet connection</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100">
        <div className="text-blue-500 text-center p-4 animate-pulse">
          <Loader className="h-8 w-8 mx-auto animate-spin" />
          <p className="mt-2">Loading maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full relative overflow-hidden ${className}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || defaultOptions.center}
        zoom={zoom || defaultOptions.zoom}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
        options={{
          mapTypeId: defaultOptions.mapTypeId,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
        }}
      >
        {showTraffic && <TrafficLayer />}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeWeight: 6,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;