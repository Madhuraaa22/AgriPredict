import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TEXTS } from '../constants';
import { CheckCircleIcon, XCircleIcon } from './icons'; // Assuming you have these icons

interface WaterLevelMonitorProps {
  language: Language;
}

const WaterLevelMonitor: React.FC<WaterLevelMonitorProps> = ({ language }) => {
  const [moistureLevel, setMoistureLevel] = useState<number | null>(null);
  const T = TEXTS[language];

  useEffect(() => {
    // Simulate fetching data from ESP32 via backend
    const interval = setInterval(() => {
      // Generate a random moisture level between 10% and 90%
      const newLevel = Math.floor(Math.random() * 81) + 10;
      setMoistureLevel(newLevel);
    }, 3000);

    // Initial fetch
    setTimeout(() => setMoistureLevel(Math.floor(Math.random() * 81) + 10), 500);

    return () => clearInterval(interval);
  }, []);

  const getRecommendation = () => {
    if (moistureLevel === null) return { text: '', icon: null, color: '' };
    if (moistureLevel < 30) return { text: T.lowMoisture, icon: <XCircleIcon className="h-6 w-6 text-yellow-800 dark:text-yellow-200" />, color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-400' };
    if (moistureLevel > 70) return { text: T.highMoisture, icon: <XCircleIcon className="h-6 w-6 text-red-800 dark:text-red-200" />, color: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-400' };
    return { text: T.goodMoisture, icon: <CheckCircleIcon className="h-6 w-6 text-green-800 dark:text-green-200" />, color: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-400' };
  };

  const getBarColor = () => {
    if (moistureLevel === null) return 'bg-gray-400';
    if (moistureLevel < 30) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (moistureLevel > 70) return 'bg-gradient-to-r from-red-500 to-red-700';
    return 'bg-gradient-to-r from-blue-400 to-cyan-500';
  };

  const recommendation = getRecommendation();

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{T.waterMonitor}</h2>
        {moistureLevel === null ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">{T.fetchingData}</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{T.soilMoisture}</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-8 my-4 relative overflow-hidden shadow-inner">
              <div
                className={`h-8 rounded-full transition-all duration-1000 ease-out ${getBarColor()}`}
                style={{ width: `${moistureLevel}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                {moistureLevel}%
              </span>
            </div>
            <div className={`mt-6 p-4 rounded-lg flex items-center space-x-4 border-l-4 ${recommendation.color}`}>
              <div className="flex-shrink-0">{recommendation.icon}</div>
              <p className="font-medium">{recommendation.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterLevelMonitor;