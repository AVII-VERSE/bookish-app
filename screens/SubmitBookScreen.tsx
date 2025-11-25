
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS } from '../theme';

interface SubmitBookScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const SubmitBookScreen: React.FC<SubmitBookScreenProps> = ({ onNavigate, isDark = true }) => {
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const cardColor = isDark ? COLORS.surfaceDark : '#FFF';

  const [formData, setFormData] = useState({ title: '', price: '', format: 'Ebook', genre: '' });

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={[styles.header, { borderBottomColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
        <TouchableOpacity onPress={() => onNavigate(ScreenName.DASHBOARD)}>
            <Icon name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Submit Book</Text>
        <Icon name="more-vert" size={24} color={textColor} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepContainer}>
            <Text style={styles.stepText}>Step 1 of 4</Text>
            <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: '25%', backgroundColor: COLORS.primary }]} />
            </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Book Details</Text>
            
            <View style={styles.uploadArea}>
                <Icon name="add-photo-alternate" size={40} color={COLORS.slate400} />
                <Text style={{ color: COLORS.slate500, marginTop: 8 }}>Upload Cover</Text>
            </View>

            <Input label="Book Title" isDark={isDark} />
            <Input label="Subtitle (Optional)" isDark={isDark} />
            <Input label="Author" isDark={isDark} />
            
            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <Input label="Price ($)" keyboardType="numeric" isDark={isDark} />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Input label="Format" placeholder="Ebook" isDark={isDark} />
                </View>
            </View>

            <View style={styles.aiRow}>
                <Text style={[styles.label, { color: textColor }]}>Synopsis</Text>
                <TouchableOpacity style={styles.aiBtn}>
                    <Icon name="auto-awesome" size={16} color={COLORS.secondary} />
                    <Text style={{ color: COLORS.secondary, fontSize: 12, fontWeight: 'bold', marginLeft: 4 }}>Generate</Text>
                </TouchableOpacity>
            </View>
            <Input multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} isDark={isDark} placeholder="Enter summary..." />

            <View style={styles.divider} />
            <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 }]}>Categorization</Text>
            <Input label="Primary Genre" placeholder="Select Genre" isDark={isDark} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: bgColor, borderTopColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
        <Button variant="outline" style={{ flex: 1, marginRight: 8 }}>Draft</Button>
        <Button variant="secondary" style={{ flex: 1, marginLeft: 8 }}>Next</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center', borderBottomWidth: 1 },
  headerTitle: { fontWeight: 'bold', fontSize: 18 },
  content: { padding: 16, paddingBottom: 100 },
  stepContainer: { marginBottom: 16 },
  stepText: { textAlign: 'center', color: COLORS.slate500, marginBottom: 8 },
  progressTrack: { height: 4, backgroundColor: COLORS.slate200, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%' },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  uploadArea: { height: 150, borderWidth: 2, borderColor: COLORS.slate800, borderStyle: 'dashed', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  row: { flexDirection: 'row' },
  aiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontWeight: '500' },
  aiBtn: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: COLORS.slate800, marginVertical: 20 },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0 }
});
