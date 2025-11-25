
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { COLORS } from '../theme';

interface MarketplaceScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate, isDark = true }) => {
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  
  const books = [
    { title: 'The Midnight Library', author: 'Matt Haig', price: '$15.99', img: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2606&auto=format&fit=crop' },
    { title: 'Project Hail Mary', author: 'Andy Weir', price: '$18.50', img: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?q=80&w=2544&auto=format&fit=crop' },
    { title: 'Dune', author: 'Frank Herbert', price: '$12.00', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2588&auto=format&fit=crop' },
    { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', price: '$14.75', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2574&auto=format&fit=crop' },
  ];

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
            <Icon name="search" size={20} color={COLORS.slate400} />
            <TextInput 
                placeholder="Search..." 
                placeholderTextColor={COLORS.slate400} 
                style={[styles.input, { color: textColor }]} 
            />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats}>
        {['Featured', 'Fiction', 'Fantasy', 'Sci-Fi'].map((c, i) => (
            <TouchableOpacity key={i} style={[styles.catChip, { backgroundColor: i === 0 ? COLORS.primary : (isDark ? COLORS.slate800 : COLORS.slate200) }]}>
                <Text style={{ color: i === 0 ? '#FFF' : textColor, fontSize: 12, fontWeight: '600' }}>{c}</Text>
            </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.topBar}>
        <Text style={[styles.logo, { color: COLORS.primary }]}>BookHaven</Text>
        <Icon name="shopping-cart" size={24} color={textColor} />
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.title}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => onNavigate(ScreenName.BOOK_DETAILS)}
            >
                <Image source={{ uri: item.img }} style={styles.cardImg} />
                <Text numberOfLines={1} style={[styles.cardTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={styles.cardAuthor}>{item.author}</Text>
                <Text style={[styles.cardPrice, { color: textColor }]}>{item.price}</Text>
            </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  logo: { fontWeight: 'bold', fontSize: 20 },
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 24, height: 44 },
  input: { flex: 1, marginLeft: 8 },
  cats: { paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row' },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginRight: 8 },
  card: { width: '48%', marginBottom: 16 },
  cardImg: { width: '100%', height: 220, borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontWeight: '600', fontSize: 14 },
  cardAuthor: { color: COLORS.slate500, fontSize: 12 },
  cardPrice: { fontWeight: 'bold', marginTop: 4 }
});
