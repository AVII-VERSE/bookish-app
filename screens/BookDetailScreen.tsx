
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { Button } from '../components/Button';
import { COLORS } from '../theme';

interface BookDetailScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ onNavigate, isDark = true }) => {
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate(ScreenName.MARKETPLACE)}>
          <Icon name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Book Details</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Icon name="bookmark-border" size={24} color={textColor} />
          <Icon name="share" size={24} color={textColor} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2606&auto=format&fit=crop" }}
            style={styles.cover}
          />
        </View>

        <View style={styles.info}>
          <Text style={[styles.title, { color: textColor }]}>The Midnight Library</Text>
          <Text style={styles.author}>by Matt Haig</Text>
          <View style={styles.rating}>
            <View style={{ flexDirection: 'row' }}>
               {[1,2,3,4].map(i => <Icon key={i} name="star" size={18} color={COLORS.amber500} />)}
               <Icon name="star-half" size={18} color={COLORS.amber500} />
            </View>
            <Text style={[styles.ratingVal, { color: textColor }]}>4.5</Text>
            <Text style={{ color: COLORS.slate500 }}>(1,280 reviews)</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button variant="ghost" style={{ backgroundColor: 'rgba(23, 84, 207, 0.1)', flex: 1 }}>Read Sample</Button>
          <Button style={{ flex: 1 }}>Buy for $14.99</Button>
        </View>

        <Text style={[styles.desc, { color: isDark ? COLORS.slate200 : COLORS.slate500 }]}>
            Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  headerTitle: { fontWeight: 'bold', fontSize: 18 },
  content: { paddingBottom: 40 },
  coverContainer: { alignItems: 'center', marginVertical: 20 },
  cover: { width: 200, height: 300, borderRadius: 12 },
  info: { alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  author: { color: COLORS.primary, fontWeight: '600', marginBottom: 12 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingVal: { fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 12, padding: 20 },
  desc: { paddingHorizontal: 20, lineHeight: 24, fontSize: 16 }
});
