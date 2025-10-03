import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { TEXTS, INDIAN_STATES } from '../constants';
import { LeafIcon } from './icons';

interface RegisterProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
  language: Language;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateToLogin, language }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const T = TEXTS[language];

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (passwordStrength < 4) {
      alert("Password is not strong enough.");
      return;
    }
    // Mock registration
    console.log({ username, email, state, city });
    onRegister();
  };
  
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-200 dark:from-gray-900 dark:to-green-900/50 p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-green-600 rounded-full">
                <LeafIcon className="h-8 w-8 text-white"/>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{T.registerTitle}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label={T.username} type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          <InputField label={T.email} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{T.state}</label>
            <select value={state} onChange={e => setState(e.target.value)} required className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <InputField label={T.city} type="text" value={city} onChange={e => setCity(e.target.value)} required />
          <div>
            <InputField label={T.password} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {password.length > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${passwordStrength * 20}%` }}></div>
                </div>
            )}
          </div>
          <InputField label={T.confirmPassword} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-transform duration-300"
            >
              {T.register}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {T.haveAccount}{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-green-600 hover:text-green-500 hover:underline">
            {T.signIn}
          </button>
        </p>
      </div>
    </div>
  );
};

const InputField: React.FC<{label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean}> = ({label, type, value, onChange, required}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input type={type} value={value} onChange={onChange} required={required} className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
    </div>
);


export default Register;