
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { COLORS } from '../theme';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, isDark = true }) => {
  const items = [
    { label: 'Home', icon: 'home', screen: ScreenName.MARKETPLACE },
    { label: 'Library', icon: 'collections-bookmark', screen: ScreenName.LIBRARY },
    { label: 'Submit', icon: 'add-circle', screen: ScreenName.SUBMIT_BOOK },
    { label: 'Dashboard', icon: 'dashboard', screen: ScreenName.DASHBOARD },
    { label: 'Profile', icon: 'person', screen: ScreenName.PROFILE },
  ];

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? COLORS.backgroundDark : COLORS.surfaceLight,
        borderTopColor: isDark ? COLORS.slate800 : COLORS.slate200 
      }
    ]}>
      {items.map((item) => {
        const isActive = currentScreen === item.screen;
        const color = isActive 
          ? (isDark ? COLORS.textDark : COLORS.primary) 
          : COLORS.slate400;

        return (
          <TouchableOpacity
            key={item.label}
            onPress={() => onNavigate(item.screen)}
            style={styles.item}
          >
            <Icon name={item.icon} size={24} color={color} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  }
});
