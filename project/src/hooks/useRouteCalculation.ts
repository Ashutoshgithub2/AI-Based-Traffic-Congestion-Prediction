import { useState, useCallback } from 'react';
import { Location, RouteAlternative, CongestionLevel } from '../types';
import { calculateRoute, determineCongestionLevel } from '../utils/mapUtils';

const useRouteCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [alternatives, setAlternatives] = useState<RouteAlternative[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getRoute = useCallback(async (
    origin: Location, 
    destination: Location,
  ) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const result = await calculateRoute(origin, destination);
      
      if (!result || !result.routes || result.routes.length === 0) {
        setError('No routes found');
        setDirections(null);
        setAlternatives([]);
        return null;
      }
      
      setDirections(result);
      
      // Process alternatives
      const routeAlternatives: RouteAlternative[] = result.routes.map((route, index) => {
        const leg = route.legs[0];
        if (!leg) {
          return {} as RouteAlternative;
        }
        
        const duration = leg.duration?.value || 0;
        const distance = leg.distance?.value || 0;
        const typicalDuration = leg.duration_in_traffic?.value || duration;
        
        const congestionLevel = determineCongestionLevel(
          typicalDuration / 60,
          duration / 60
        );
        
        // Calculate time savings compared to the slowest route
        const slowestDuration = Math.max(
          ...result.routes.map(r => r.legs[0]?.duration?.value || 0)
        );
        const savingsInMinutes = Math.round((slowestDuration - duration) / 60);
        
        return {
          id: `route-${index}`,
          name: route.summary || `Route ${index + 1}`,
          origin,
          destination,
          duration: Math.round(duration / 60),
          distance: Math.round(distance / 1000),
          congestionLevel,
          savingsInMinutes,
        };
      });
      
      setAlternatives(routeAlternatives);
      return result;
    } catch (err) {
      console.error('Error calculating route:', err);
      setError('Failed to calculate route');
      setDirections(null);
      setAlternatives([]);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  return {
    getRoute,
    directions,
    alternatives,
    isCalculating,
    error
  };
};

export default useRouteCalculation;