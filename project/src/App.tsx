import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import MapView from './components/MapView';
import DestinationInput from './components/DestinationInput';
import PredictionPanel from './components/PredictionPanel';
import RouteAlternatives from './components/RouteAlternatives';
import { Location, RouteAlternative, TrafficPrediction, PredictionTimeframe } from './types';
import useRouteCalculation from './hooks/useRouteCalculation';
import usePrediction from './hooks/usePrediction';

function App() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>({ 
    value: 30, unit: 'minutes', label: '30 min' 
  });
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<TrafficPrediction | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteAlternative | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { getRoute, directions, alternatives, isCalculating } = useRouteCalculation();
  const { predictTraffic, isPredicting } = usePrediction();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setCurrentLocation({ lat: 40.7128, lng: -74.0060 });
      }
    );
  }, []);

  const handleRouteSelect = async (origin: Location, destination: Location) => {
    setIsNavigating(false);
    const routeResult = await getRoute(origin, destination);
    
    if (routeResult && alternatives.length > 0) {
      setSelectedRoute(alternatives[0]);
      
      const prediction = await predictTraffic(
        alternatives[0].id,
        origin,
        destination,
        selectedTimeframe.value
      );
      
      if (prediction) {
        setCurrentPrediction(prediction);
      }
    }
  };

  const handleTimeframeChange = async (timeframe: PredictionTimeframe) => {
    setSelectedTimeframe(timeframe);
    
    if (selectedRoute) {
      const prediction = await predictTraffic(
        selectedRoute.id,
        selectedRoute.origin,
        selectedRoute.destination,
        timeframe.value
      );
      
      if (prediction) {
        setCurrentPrediction(prediction);
      }
    }
  };

  const handleAlternativeSelect = async (route: RouteAlternative) => {
    setSelectedRoute(route);
    
    const prediction = await predictTraffic(
      route.id,
      route.origin,
      route.destination,
      selectedTimeframe.value
    );
    
    if (prediction) {
      setCurrentPrediction(prediction);
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleExitNavigation = () => {
    setIsNavigating(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {!isNavigating && <Header />}
      
      <div className="flex-1 relative">
        <MapView
          center={currentLocation || undefined}
          directions={directions}
          showTraffic={true}
        />
        
        {!isNavigating && (
          <>
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-96"
              >
                <DestinationInput 
                  onRouteSelect={handleRouteSelect}
                />
              </motion.div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-4">
              {(alternatives.length > 0 || isPredicting || currentPrediction) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
                >
                  <PredictionPanel
                    prediction={currentPrediction}
                    isLoading={isPredicting}
                    onTimeframeChange={handleTimeframeChange}
                  />
                  
                  {alternatives.length > 0 && (
                    <RouteAlternatives
                      alternatives={alternatives}
                      onSelectRoute={handleAlternativeSelect}
                      selectedRouteId={selectedRoute?.id}
                      onStartNavigation={handleStartNavigation}
                    />
                  )}
                </motion.div>
              )}
            </div>
          </>
        )}
        
        {isNavigating && (
          <button
            onClick={handleExitNavigation}
            className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50"
          >
            Exit Navigation
          </button>
        )}
      </div>
    </div>
  );
}

export default App;