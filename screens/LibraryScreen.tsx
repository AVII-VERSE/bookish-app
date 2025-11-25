
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { ScreenName } from '../types';
import { COLORS } from '../theme';

interface LibraryScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ onNavigate, isDark = true }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'wishlist'>('current');
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  
  const books = [
    { title: 'Dune', author: 'Frank Herbert', progress: 45, img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2588&auto=format&fit=crop' },
    { title: 'Project Hail Mary', author: 'Andy Weir', progress: 12, img: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?q=80&w=2544&auto=format&fit=crop' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Library</Text>
        <View style={[styles.tabs, { backgroundColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
            <TouchableOpacity onPress={() => setActiveTab('current')} style={[styles.tab, activeTab === 'current' && styles.activeTab]}>
                <Text style={{ color: activeTab === 'current' ? '#000' : COLORS.slate500 }}>Current</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('wishlist')} style={[styles.tab, activeTab === 'wishlist' && styles.activeTab]}>
                <Text style={{ color: activeTab === 'wishlist' ? '#000' : COLORS.slate500 }}>Wishlist</Text>
            </TouchableOpacity>
        </View>
      </View>

      <FlatList 
        data={books}
        keyExtractor={item => item.title}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: isDark ? COLORS.surfaceDark : '#FFF', borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <Image source={{ uri: item.img }} style={styles.img} />
                <View style={styles.info}>
                    <Text style={[styles.bookTitle, { color: textColor }]}>{item.title}</Text>
                    <Text style={{ color: COLORS.slate500 }}>{item.author}</Text>
                    <View style={styles.progressContainer}>
                        <Text style={{ color: COLORS.slate500, fontSize: 12, marginBottom: 4 }}>{item.progress}% Read</Text>
                        <View style={styles.track}>
                            <View style={[styles.bar, { width: `${item.progress}%` }]} />
                        </View>
                    </View>
                </View>
            </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 0 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  tabs: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  activeTab: { backgroundColor: '#FFF' },
  item: { flexDirection: 'row', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  img: { width: 60, height: 90, borderRadius: 6 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  bookTitle: { fontWeight: 'bold', fontSize: 16 },
  progressContainer: { marginTop: 8 },
  track: { height: 6, backgroundColor: COLORS.slate800, borderRadius: 3 },
  bar: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 }
});
