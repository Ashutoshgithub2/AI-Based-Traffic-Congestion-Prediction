import { Location, CongestionLevel } from '../types';

// Convert address to coordinates using Google Geocoding API
export const geocodeAddress = async (address: string): Promise<Location | null> => {
  try {
    const geocoder = new google.maps.Geocoder();
    const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
    
    if (result && result.length > 0) {
      return {
        lat: result[0].geometry.location.lat(),
        lng: result[0].geometry.location.lng()
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Calculate route between two points
export const calculateRoute = async (
  origin: Location,
  destination: Location
): Promise<google.maps.DirectionsResult | null> => {
  try {
    const directionsService = new google.maps.DirectionsService();
    
    const result = await directionsService.route({
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    });
    
    return result;
  } catch (error) {
    console.error('Route calculation error:', error);
    return null;
  }
};

// Get color for congestion level
export const getCongestionColor = (level: CongestionLevel): string => {
  switch (level) {
    case CongestionLevel.LOW:
      return '#10b981'; // green
    case CongestionLevel.MODERATE:
      return '#f59e0b'; // yellow
    case CongestionLevel.HIGH:
      return '#f97316'; // orange
    case CongestionLevel.SEVERE:
      return '#ef4444'; // red
    default:
      return '#3b82f6'; // blue (default)
  }
};

// Format duration in minutes to human-readable format
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
};

// Determine congestion level based on traffic data
export const determineCongestionLevel = (
  currentDuration: number,
  typicalDuration: number
): CongestionLevel => {
  const ratio = currentDuration / typicalDuration;
  
  if (ratio <= 1.1) return CongestionLevel.LOW;
  if (ratio <= 1.3) return CongestionLevel.MODERATE;
  if (ratio <= 1.6) return CongestionLevel.HIGH;
  return CongestionLevel.SEVERE;
};

// Get user's current location
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};