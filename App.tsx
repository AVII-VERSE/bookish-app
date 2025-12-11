
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet, useColorScheme } from 'react-native';
import { ScreenName } from './types';
import { COLORS } from './theme';

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
import { MedicalAnalysisScreen } from './screens/MedicalAnalysisScreen';
import { BottomNav } from './components/BottomNav';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.MEDICAL_ANALYSIS);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark'; // Or force true as per web design defaults

  const showBottomNav = [
    ScreenName.DASHBOARD,
    ScreenName.MARKETPLACE,
    ScreenName.SUBMIT_BOOK,
    ScreenName.LIBRARY,
    ScreenName.PROFILE
  ].includes(currentScreen);

  const renderScreen = () => {
    const props = { onNavigate: setCurrentScreen, isDark: true }; // Enforcing dark mode for now to match web style

    switch (currentScreen) {
      case ScreenName.SPLASH: return <SplashScreen {...props} />;
      case ScreenName.LANDING: return <LandingScreen {...props} />;
      case ScreenName.AUTH: return <AuthScreen {...props} />;
      case ScreenName.DASHBOARD: return <DashboardScreen {...props} />;
      case ScreenName.BOOK_DETAILS: return <BookDetailScreen {...props} />;
      case ScreenName.MARKETPLACE: return <MarketplaceScreen {...props} />;
      case ScreenName.SUBMIT_BOOK: return <SubmitBookScreen {...props} />;
      case ScreenName.LIBRARY: return <LibraryScreen {...props} />;
      case ScreenName.PROFILE: return <ProfileScreen {...props} />;
      case ScreenName.NOTIFICATIONS: return <NotificationScreen {...props} />;
      case ScreenName.MEDICAL_ANALYSIS: return <MedicalAnalysisScreen {...props} />;
      default: return <MedicalAnalysisScreen {...props} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {showBottomNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  content: {
    flex: 1,
  }
});

export default App;
