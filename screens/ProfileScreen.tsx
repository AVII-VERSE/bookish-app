
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { COLORS } from '../theme';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, isDark = true }) => {
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const cardColor = isDark ? COLORS.surfaceDark : '#FFF';

  const menuItems = [
    { icon: 'person', label: 'Account Settings' },
    { icon: 'notifications', label: 'Notifications' },
    { icon: 'lock', label: 'Privacy & Security' },
    { icon: 'help', label: 'Help & Support' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.headerBanner}>
        <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" }}
              style={styles.avatar}
            />
        </View>
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={[styles.name, { color: textColor }]}>Alex Johnson</Text>
        <Text style={styles.email}>alex@example.com</Text>
        
        <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <Text style={[styles.statNum, { color: textColor }]}>12</Text>
                <Text style={styles.statLabel}>Books</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <Text style={[styles.statNum, { color: textColor }]}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
            </View>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.menuItem, { backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={item.icon} size={24} color={COLORS.slate500} style={{ marginRight: 16 }} />
                    <Text style={{ color: textColor, fontSize: 16 }}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.slate500} />
            </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
            onPress={() => onNavigate(ScreenName.AUTH)}
            style={[styles.menuItem, { marginTop: 16, backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}
        >
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="logout" size={24} color={COLORS.red500} style={{ marginRight: 16 }} />
                <Text style={{ color: COLORS.red500, fontSize: 16 }}>Log Out</Text>
            </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBanner: { height: 150, backgroundColor: COLORS.primary, marginBottom: 50, position: 'relative' },
  avatarContainer: { position: 'absolute', bottom: -50, left: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: COLORS.backgroundDark },
  profileInfo: { paddingHorizontal: 24, marginBottom: 24 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { color: COLORS.slate500, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 16 },
  statBox: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: COLORS.slate500, textTransform: 'uppercase' },
  menu: { paddingHorizontal: 24, paddingBottom: 100 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 8 }
});
