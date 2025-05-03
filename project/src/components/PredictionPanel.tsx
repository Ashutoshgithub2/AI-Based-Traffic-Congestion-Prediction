import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { TrafficPrediction, CongestionLevel, PredictionTimeframe } from '../types';
import { getCongestionColor, formatDuration } from '../utils/mapUtils';

interface PredictionPanelProps {
  prediction: TrafficPrediction | null;
  isLoading: boolean;
  onTimeframeChange: (timeframe: PredictionTimeframe) => void;
  className?: string;
}

const timeframes: PredictionTimeframe[] = [
  { value: 15, unit: 'minutes', label: '15 min' },
  { value: 30, unit: 'minutes', label: '30 min' },
  { value: 60, unit: 'minutes', label: '1 hour' }
];

const PredictionPanel: React.FC<PredictionPanelProps> = ({
  prediction,
  isLoading,
  onTimeframeChange,
  className = ''
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>(timeframes[1]);

  const handleTimeframeChange = (timeframe: PredictionTimeframe) => {
    setSelectedTimeframe(timeframe);
    onTimeframeChange(timeframe);
  };

  const getCongestionTitle = (level: CongestionLevel) => {
    switch (level) {
      case CongestionLevel.LOW:
        return 'Low Traffic';
      case CongestionLevel.MODERATE:
        return 'Moderate Traffic';
      case CongestionLevel.HIGH:
        return 'Heavy Traffic';
      case CongestionLevel.SEVERE:
        return 'Severe Congestion';
      default:
        return 'Unknown';
    }
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.5) return 'Moderate';
    if (confidence >= 0.3) return 'Low';
    return 'Very Low';
  };

  return (
    <div className={`bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Traffic Prediction</h2>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">Predict for:</span>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTimeframe.label === tf.label
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-8">
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Analyzing traffic patterns...</p>
          </motion.div>
        </div>
      ) : prediction ? (
        <motion.div
          className="rounded-lg border border-gray-100 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-3">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getCongestionColor(prediction.congestionLevel) }}
            />
            <h3 className="font-medium text-gray-900">
              {getCongestionTitle(prediction.congestionLevel)}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" /> 
              <span>
                {formatDuration(prediction.predictedDuration)}
              </span>
            </div>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {prediction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Prediction confidence:</span>
            <span className="text-sm font-medium">
              {getConfidenceLabel(prediction.confidence)} 
              ({Math.round(prediction.confidence * 100)}%)
            </span>
          </div>
          
          <div className="h-2 bg-gray-100 rounded overflow-hidden">
            <div 
              className="h-full rounded"
              style={{
                width: `${prediction.confidence * 100}%`,
                backgroundColor: prediction.confidence > 0.7 ? '#10b981' : prediction.confidence > 0.4 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
          
          {prediction.congestionLevel === CongestionLevel.HIGH || 
           prediction.congestionLevel === CongestionLevel.SEVERE ? (
            <div className="mt-4 flex items-start gap-2 text-sm bg-amber-50 p-3 rounded-md border border-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium">Potential delays ahead</p>
                <p className="text-amber-700 mt-1">Consider alternative routes or adjusting your departure time.</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 text-sm bg-green-50 p-3 rounded-md border border-green-100">
              <TrendingDown className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">Traffic flowing smoothly</p>
                <p className="text-green-700 mt-1">Expected travel time is within normal range.</p>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="py-6 text-center text-gray-500">
          <ArrowRight className="h-8 w-8 mx-auto mb-3 text-gray-400" />
          <p>Select origin and destination to get traffic predictions</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;