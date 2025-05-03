import { useState, useCallback } from 'react';
import { TrafficPrediction, CongestionLevel, Location } from '../types';

// This is a mock implementation since we don't have a real AI model
// In a real application, this would call an API that uses ML models
const usePrediction = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<TrafficPrediction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const predictTraffic = useCallback(async (
    routeId: string,
    origin: Location,
    destination: Location,
    timeOffset: number = 30 // minutes from now
  ) => {
    setIsPredicting(true);
    setError(null);
    
    try {
      // In a real app, we would call an AI service here
      // This is a mock implementation that returns random predictions
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate random but somewhat realistic predictions
      const futureTimestamp = new Date();
      futureTimestamp.setMinutes(futureTimestamp.getMinutes() + timeOffset);
      
      // Random congestion levels with higher probability for certain levels based on time of day
      const hour = new Date().getHours();
      let congestionProbabilities: { level: CongestionLevel, weight: number }[] = [];
      
      // Morning rush (7-9am)
      if (hour >= 7 && hour <= 9) {
        congestionProbabilities = [
          { level: CongestionLevel.LOW, weight: 0.1 },
          { level: CongestionLevel.MODERATE, weight: 0.2 },
          { level: CongestionLevel.HIGH, weight: 0.4 },
          { level: CongestionLevel.SEVERE, weight: 0.3 },
        ];
      } 
      // Evening rush (4-7pm)
      else if (hour >= 16 && hour <= 19) {
        congestionProbabilities = [
          { level: CongestionLevel.LOW, weight: 0.1 },
          { level: CongestionLevel.MODERATE, weight: 0.3 },
          { level: CongestionLevel.HIGH, weight: 0.4 },
          { level: CongestionLevel.SEVERE, weight: 0.2 },
        ];
      }
      // Mid-day
      else if (hour > 9 && hour < 16) {
        congestionProbabilities = [
          { level: CongestionLevel.LOW, weight: 0.3 },
          { level: CongestionLevel.MODERATE, weight: 0.4 },
          { level: CongestionLevel.HIGH, weight: 0.2 },
          { level: CongestionLevel.SEVERE, weight: 0.1 },
        ];
      }
      // Evening/night
      else {
        congestionProbabilities = [
          { level: CongestionLevel.LOW, weight: 0.6 },
          { level: CongestionLevel.MODERATE, weight: 0.3 },
          { level: CongestionLevel.HIGH, weight: 0.1 },
          { level: CongestionLevel.SEVERE, weight: 0 },
        ];
      }
      
      // Weighted random selection
      const totalWeight = congestionProbabilities.reduce((sum, item) => sum + item.weight, 0);
      let random = Math.random() * totalWeight;
      let selectedLevel = congestionProbabilities[0].level;
      
      for (const item of congestionProbabilities) {
        random -= item.weight;
        if (random <= 0) {
          selectedLevel = item.level;
          break;
        }
      }
      
      // Base duration in minutes (30-90 min)
      const baseDuration = 30 + Math.floor(Math.random() * 60);
      
      // Adjust duration based on congestion level
      let predictedDuration = baseDuration;
      switch (selectedLevel) {
        case CongestionLevel.LOW:
          predictedDuration = baseDuration;
          break;
        case CongestionLevel.MODERATE:
          predictedDuration = Math.floor(baseDuration * 1.2);
          break;
        case CongestionLevel.HIGH:
          predictedDuration = Math.floor(baseDuration * 1.5);
          break;
        case CongestionLevel.SEVERE:
          predictedDuration = Math.floor(baseDuration * 2);
          break;
      }
      
      // Generate confidence level (0.5-1.0)
      const confidence = 0.5 + Math.random() * 0.5;
      
      const prediction: TrafficPrediction = {
        id: `pred-${Date.now()}`,
        routeId,
        timestamp: futureTimestamp,
        congestionLevel: selectedLevel,
        predictedDuration,
        confidence
      };
      
      setPredictions(prev => [...prev, prediction]);
      return prediction;
    } catch (err) {
      console.error('Error predicting traffic:', err);
      setError('Failed to predict traffic conditions');
      return null;
    } finally {
      setIsPredicting(false);
    }
  }, []);

  return {
    predictTraffic,
    predictions,
    isPredicting,
    error
  };
};

export default usePrediction;