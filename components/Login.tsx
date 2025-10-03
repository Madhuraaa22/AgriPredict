import React, { useState } from 'react';
import { Language, User } from '../types';
import { TEXTS } from '../constants';
import { LeafIcon } from './icons';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
  language: Language;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const T = TEXTS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    const mockUser: User = {
      username: 'FarmerJohn',
      email,
      region: { state: 'Maharashtra', city: 'Pune' },
    };
    onLogin(mockUser);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-200 dark:from-gray-900 dark:to-green-900/50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-green-600 rounded-full">
                <LeafIcon className="h-8 w-8 text-white"/>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{T.loginTitle}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {T.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {T.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-transform duration-300"
            >
              {T.login}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {T.noAccount}{' '}
          <button onClick={onNavigateToRegister} className="font-medium text-green-600 hover:text-green-500 hover:underline">
            {T.signUp}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;