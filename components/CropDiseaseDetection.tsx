import React, { useState, useRef } from 'react';
import { Language, DiseaseDetectionResult } from '../types';
import { TEXTS } from '../constants';
import { detectDisease } from '../services/geminiService';
import Chatbot from './Chatbot';
import { CameraIcon, UploadIcon, LeafIcon } from './icons';

interface CropDiseaseDetectionProps {
  language: Language;
}

const CropDiseaseDetection: React.FC<CropDiseaseDetectionProps> = ({ language }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const T = TEXTS[language];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
      handleDetect(file);
    }
  };

  const handleDetect = async (file: File) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await detectDisease(file, language);
      const parsedResult = JSON.parse(response.text);
      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError('Failed to detect disease. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const triggerFileUpload = () => {
      fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{T.cropDiseaseDetection}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Image Upload */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">{T.uploadImage}</h3>
            {imagePreview ? (
              <img src={imagePreview} alt="Plant preview" className="w-full h-auto max-h-72 object-contain rounded-lg mb-4 shadow-md" />
            ) : (
                <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg mb-4">
                    <LeafIcon className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full">
                 <button 
                    onClick={triggerFileUpload}
                    className="flex flex-1 items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                    <UploadIcon className="h-5 w-5 mr-2"/>
                    {T.upload}
                </button>
                 <button 
                    onClick={triggerFileUpload}
                    className="flex flex-1 items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                    <CameraIcon className="h-5 w-5 mr-2"/>
                    {T.capture}
                </button>
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>

          {/* Right Panel: Result and Chatbot */}
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <LeafIcon className="h-16 w-16 text-green-500 animate-spin"/>
                <p className="ml-4 text-lg mt-4 font-semibold text-gray-600 dark:text-gray-300">{T.detecting}</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                 <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">{T.diseaseResult}</h3>
                    <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner">
                      <div className="mb-3">
                        <strong className="font-semibold text-gray-700 dark:text-gray-200">{T.diseaseName}:</strong>
                        <p className="text-lg text-green-700 dark:text-green-400 font-bold">{result.diseaseName}</p>
                      </div>
                      <div>
                        <strong className="font-semibold text-gray-700 dark:text-gray-200">{T.recommendedSolution}:</strong>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{result.solution}</p>
                      </div>
                    </div>
                </div>
                <div>
                  <Chatbot language={language} initialContext={result} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8">
                <p className="text-gray-500 dark:text-gray-400 text-center">Upload an image of a plant leaf to get an instant disease diagnosis and treatment plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDiseaseDetection;