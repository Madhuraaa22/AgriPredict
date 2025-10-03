import React, { useState, useCallback } from 'react';
import { Language, Page, User } from './types';
import { TEXTS } from './constants';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import CropDiseaseDetection from './components/CropDiseaseDetection';
import Marketplace from './components/Marketplace';
import GovernmentSchemes from './components/GovernmentSchemes';
import WaterLevelMonitor from './components/WaterLevelMonitor';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  const [language, setLanguage] = useState<Language>(Language.EN);
  
  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentPage(Page.CropDiseaseDetection);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage(Page.Login);
  }, []);
  
  const navigateTo = useCallback((page: Page) => {
    if(isAuthenticated) {
      setCurrentPage(page);
    } else if (page === Page.Register) {
        setCurrentPage(Page.Register);
    } else {
        setCurrentPage(Page.Login);
    }
  }, [isAuthenticated]);

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case Page.Login:
          return <Login onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage(Page.Register)} language={language} />;
        case Page.Register:
          return <Register onRegister={() => setCurrentPage(Page.Login)} onNavigateToLogin={() => setCurrentPage(Page.Login)} language={language} />;
        default:
          return <Login onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage(Page.Register)} language={language} />;
      }
    }
    
    switch (currentPage) {
      case Page.CropDiseaseDetection:
        return <CropDiseaseDetection language={language} />;
      case Page.Marketplace:
        return <Marketplace language={language} />;
      case Page.GovernmentSchemes:
        return <GovernmentSchemes language={language} />;
      case Page.WaterLevelMonitor:
        return <WaterLevelMonitor language={language} />;
      default:
        return <CropDiseaseDetection language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {isAuthenticated && currentUser && (
        <Header 
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={navigateTo}
          currentPage={currentPage}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      <main className="p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;