
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from "react-native-chart-kit";
import { ScreenName } from '../types';
import { COLORS } from '../theme';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, isDark = true }) => {
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;
  const cardColor = isDark ? COLORS.surfaceDark : '#FFF';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { backgroundColor: bgColor }]}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => onNavigate(ScreenName.PROFILE)}>
                <Image 
                    source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" }}
                    style={styles.avatar}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate(ScreenName.NOTIFICATIONS)} style={styles.notifBtn}>
                <Icon name="notifications" size={24} color={textColor} />
                <View style={styles.badge} />
            </TouchableOpacity>
        </View>
        <Text style={[styles.welcome, { color: textColor }]}>Welcome, Alex</Text>
      </View>

      <View style={styles.statsGrid}>
        {[
            { label: 'Total Revenue', value: '$12,482', change: '+5.2%', positive: true },
            { label: 'Units Sold', value: '856', change: '+12.1%', positive: true },
            { label: 'Avg. Rating', value: '4.8', change: '-0.1', positive: false },
            { label: 'New Reviews', value: '23', change: '+8', positive: true },
        ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{stat.value}</Text>
                <Text style={{ color: stat.positive ? COLORS.green500 : COLORS.amber500, fontSize: 12 }}>{stat.change}</Text>
            </View>
        ))}
      </View>

      <View style={styles.chartContainer}>
         <View style={[styles.chartCard, { backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
            <Text style={[styles.chartTitle, { color: textColor }]}>Sales Performance</Text>
            <Text style={[styles.chartTotal, { color: textColor }]}>$4,120</Text>
            
            <LineChart
                data={{
                  labels: ["W1", "W2", "W3", "W4"],
                  datasets: [{ data: [2000, 2100, 2400, 4120] }]
                }}
                width={Dimensions.get("window").width - 60} 
                height={220}
                yAxisLabel="$"
                chartConfig={{
                  backgroundColor: cardColor,
                  backgroundGradientFrom: cardColor,
                  backgroundGradientTo: cardColor,
                  decimalPlaces: 0, 
                  color: (opacity = 1) => `rgba(23, 84, 207, ${opacity})`,
                  labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "6", strokeWidth: "2", stroke: COLORS.primary }
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
         </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>My Books</Text>
        {[
            { title: 'The Silent Observer', rating: '4.9', count: '2,184', img: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3786&auto=format&fit=crop' },
            { title: 'Echoes of the Void', rating: '4.7', count: '1,530', img: 'https://images.unsplash.com/photo-1620052581237-5d36667be337?q=80&w=2574&auto=format&fit=crop' }
        ].map((book, i) => (
            <TouchableOpacity key={i} style={[styles.bookCard, { backgroundColor: cardColor, borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <Image source={{ uri: book.img }} style={styles.bookCover} />
                <View style={styles.bookInfo}>
                    <Text style={[styles.bookTitle, { color: textColor }]}>{book.title}</Text>
                    <View style={styles.ratingRow}>
                        <Icon name="star" size={16} color={COLORS.amber500} />
                        <Text style={styles.ratingText}>{book.rating} ({book.count})</Text>
                    </View>
                </View>
            </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} /> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  notifBtn: { padding: 8 },
  badge: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.red500, position: 'absolute', top: 8, right: 8 },
  welcome: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  statCard: { width: '45%', margin: '2.5%', padding: 16, borderRadius: 12, borderWidth: 1 },
  statLabel: { color: COLORS.slate500, fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  chartContainer: { paddingHorizontal: 20, marginBottom: 20 },
  chartCard: { padding: 16, borderRadius: 12, borderWidth: 1 },
  chartTitle: { fontSize: 16, fontWeight: '600' },
  chartTotal: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  bookCard: { flexDirection: 'row', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, alignItems: 'center' },
  bookCover: { width: 50, height: 75, borderRadius: 6 },
  bookInfo: { marginLeft: 12, flex: 1 },
  bookTitle: { fontWeight: '600', fontSize: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { color: COLORS.slate500, fontSize: 12, marginLeft: 4 },
});
