import React from 'react';
import { User, Page, Language } from '../types';
import { TEXTS } from '../constants';
import { LeafIcon, StoreIcon, DocumentIcon, WaterIcon, LogoutIcon } from './icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ page, currentPage, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      currentPage === page
        ? 'bg-white/20 text-white'
        : 'text-green-100 hover:bg-white/10 hover:text-white'
    }`}
    aria-current={currentPage === page ? 'page' : undefined}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, currentPage, language, setLanguage }) => {
  const T = TEXTS[language];
  const navItems = [
    { page: Page.CropDiseaseDetection, icon: <LeafIcon className="h-5 w-5" />, label: T.cropDiseaseDetection },
    { page: Page.Marketplace, icon: <StoreIcon className="h-5 w-5" />, label: T.marketplace },
    { page: Page.GovernmentSchemes, icon: <DocumentIcon className="h-5 w-5" />, label: T.govtSchemes },
    { page: Page.WaterLevelMonitor, icon: <WaterIcon className="h-5 w-5" />, label: T.waterMonitor },
  ];

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-900 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-wider">{T.appName}</h1>
          </div>
          <nav className="hidden md:flex md:space-x-4">
            {navItems.map(item => (
              <NavItem
                key={item.page}
                page={item.page}
                currentPage={currentPage}
                onClick={() => onNavigate(item.page)}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
          <div className="flex items-center space-x-4">
             <div className="relative">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-white/10 text-white rounded-md py-1 pl-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/20 transition-colors"
                    aria-label="Select language"
                >
                    <option value={Language.EN}>EN</option>
                    <option value={Language.HI}>HI</option>
                    <option value={Language.MR}>MR</option>
                </select>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium">{T.welcome}, {user.username}</div>
            </div>
            <button onClick={onLogout} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
              <LogoutIcon className="h-4 w-4"/>
              <span className="hidden sm:inline">{T.logout}</span>
            </button>
          </div>
        </div>
      </div>
       <nav className="md:hidden flex justify-around py-2 bg-green-800/50">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex flex-col items-center p-1 rounded-md text-xs transition-colors duration-200 w-1/4 ${
                currentPage === item.page
                  ? 'text-white bg-white/10'
                  : 'text-green-100 hover:text-white'
              }`}
              aria-current={currentPage === item.page ? 'page' : undefined}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
    </header>
  );
};

export default Header;