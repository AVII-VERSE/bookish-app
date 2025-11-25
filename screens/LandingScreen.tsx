
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { Button } from '../components/Button';
import { COLORS } from '../theme';

interface LandingScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, isDark = true }) => {
  const [role, setRole] = useState<'reader' | 'publisher'>('reader');
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon name="import-contacts" size={32} color={COLORS.primary} />
        <Text style={[styles.brand, { color: textColor }]}>Chapter.</Text>
      </View>
      
      <View style={styles.heroImageContainer}>
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop" }}
          style={styles.heroImage}
        />
      </View>

      <Text style={[styles.title, { color: textColor }]}>
        Your Next Chapter Awaits
      </Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleBtn, role === 'reader' && { backgroundColor: isDark ? COLORS.backgroundDark : '#FFF' }]}
          onPress={() => setRole('reader')}
        >
          <Text style={{ color: role === 'reader' ? textColor : COLORS.slate500, fontWeight: '600' }}>For Readers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, role === 'publisher' && { backgroundColor: isDark ? COLORS.backgroundDark : '#FFF' }]}
          onPress={() => setRole('publisher')}
        >
          <Text style={{ color: role === 'publisher' ? textColor : COLORS.slate500, fontWeight: '600' }}>For Publishers</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Discover thousands of books from indie authors tailored just for you.
      </Text>

      <View style={styles.features}>
         {[
           { icon: 'auto-awesome', title: 'Personalized', desc: 'Books tailored to you.' },
           { icon: 'chat-bubble', title: 'Connect', desc: 'Engage with writers.' },
           { icon: 'bookmarks', title: 'Library', desc: 'Curate your collection.' }
         ].map((item, i) => (
            <View key={i} style={[styles.featureCard, { backgroundColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <Icon name={item.icon} size={28} color={COLORS.primary} />
                <Text style={[styles.featureTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
            </View>
         ))}
      </View>

      <View style={styles.actions}>
        <Button onPress={() => onNavigate(ScreenName.AUTH)} fullWidth>
            Create Account
        </Button>
        <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => onNavigate(ScreenName.AUTH)}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 24 },
  brand: { fontSize: 24, fontWeight: 'bold', marginLeft: 8 },
  heroImageContainer: { paddingHorizontal: 16 },
  heroImage: { width: '100%', height: 220, borderRadius: 12 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', padding: 24 },
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.slate200, marginHorizontal: 24, padding: 4, borderRadius: 12, marginBottom: 16 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  subtitle: { textAlign: 'center', color: COLORS.slate500, paddingHorizontal: 24, marginBottom: 24 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, marginBottom: 32 },
  featureCard: { width: '31%', padding: 12, borderRadius: 12, alignItems: 'center', gap: 8 },
  featureTitle: { fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  featureDesc: { fontSize: 10, color: COLORS.slate500, textAlign: 'center' },
  actions: { paddingHorizontal: 16, gap: 12 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  loginText: { color: COLORS.slate500 },
  loginLink: { color: COLORS.primary, fontWeight: 'bold' }
});
