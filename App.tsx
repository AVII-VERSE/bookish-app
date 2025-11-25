import React, { useState, useEffect } from 'react';
import { ScreenName } from './types';
import { SplashScreen } from './screens/SplashScreen';
import { LandingScreen } from './screens/LandingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { MarketplaceScreen } from './screens/MarketplaceScreen';
import { SubmitBookScreen } from './screens/SubmitBookScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NotificationScreen } from './screens/NotificationScreen';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.SPLASH);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Dark Mode for Demo Purposes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showBottomNav = [
    ScreenName.DASHBOARD,
    ScreenName.MARKETPLACE,
    ScreenName.SUBMIT_BOOK,
    ScreenName.LIBRARY,
    ScreenName.PROFILE
  ].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.SPLASH:
        return <SplashScreen onNavigate={setCurrentScreen} />;
      case ScreenName.LANDING:
        return <LandingScreen onNavigate={setCurrentScreen} />;
      case ScreenName.AUTH:
        return <AuthScreen onNavigate={setCurrentScreen} />;
      case ScreenName.DASHBOARD:
        return <DashboardScreen onNavigate={setCurrentScreen} />;
      case ScreenName.BOOK_DETAILS:
        return <BookDetailScreen onNavigate={setCurrentScreen} />;
      case ScreenName.MARKETPLACE:
        return <MarketplaceScreen onNavigate={setCurrentScreen} />;
      case ScreenName.SUBMIT_BOOK:
        return <SubmitBookScreen onNavigate={setCurrentScreen} />;
      case ScreenName.LIBRARY:
        return <LibraryScreen onNavigate={setCurrentScreen} />;
      case ScreenName.PROFILE:
        return <ProfileScreen onNavigate={setCurrentScreen} />;
      case ScreenName.NOTIFICATIONS:
        return <NotificationScreen onNavigate={setCurrentScreen} />;
      default:
        return <LandingScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="relative min-h-screen max-w-lg mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
      {/* Dev Toggle for Dark Mode */}
      {currentScreen !== ScreenName.SPLASH && (
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="fixed top-2 right-2 z-50 p-2 bg-slate-200 dark:bg-slate-800 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-slate-800 dark:text-white">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      )}

      {renderScreen()}
      
      {showBottomNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </div>
  );
};

export default App;