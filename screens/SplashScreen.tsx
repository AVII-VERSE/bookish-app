
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { COLORS } from '../theme';

interface SplashScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate(ScreenName.LANDING);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="auto-stories" size={80} color={COLORS.primary} />
        <Text style={styles.title}>Bookish</Text>
        <Text style={styles.subtitle}>Your Next Chapter.</Text>
      </View>
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.slate400,
    marginTop: 8,
    fontStyle: 'italic',
  },
  loader: {
    position: 'absolute',
    bottom: 60,
  }
});
