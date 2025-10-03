import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { TEXTS, MOCK_SCHEMES } from '../constants';
import { SearchIcon } from './icons';

interface GovernmentSchemesProps {
  language: Language;
}

const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const T = TEXTS[language];

  const filteredSchemes = useMemo(() => {
    return MOCK_SCHEMES.filter(scheme =>
      scheme.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description[language].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, language]);

  return (
    <div className="container mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{T.govtSchemes}</h2>
        <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <input
                type="text"
                placeholder={T.searchSchemes}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
        </div>
        <div className="space-y-6">
          {filteredSchemes.map(scheme => (
            <div key={scheme.id} className="p-5 border-l-4 border-green-500 rounded-r-lg bg-gray-50 dark:bg-gray-700/50 shadow-md transition-all hover:shadow-lg hover:border-green-600">
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400">{scheme.title[language]}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{scheme.description[language]}</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{T.eligibility}:</h4>
                  <p className="text-gray-600 dark:text-gray-300">{scheme.eligibility[language]}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{T.benefits}:</h4>
                  <p className="text-gray-600 dark:text-gray-300">{scheme.benefits[language]}</p>
                </div>
              </div>
              <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300 py-1 px-3 rounded-full hover:bg-green-200 dark:hover:bg-green-700 transition-colors">
                {T.officialLink} &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;