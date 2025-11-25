
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { COLORS } from '../theme';

interface NotificationScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({ onNavigate, isDark = true }) => {
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  const notifications = [
    { icon: 'sell', color: COLORS.green500, title: 'New Sale!', message: 'You sold a copy of "The Silent Observer"', time: '2 mins ago' },
    { icon: 'star', color: COLORS.amber500, title: 'New Review', message: 'Sarah left a 5-star review on your book.', time: '1 hour ago' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { borderBottomColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
        <TouchableOpacity onPress={() => onNavigate(ScreenName.DASHBOARD)}>
            <Icon name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList 
        data={notifications}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: isDark ? COLORS.surfaceDark : '#FFF', borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                <View style={[styles.iconBox, { backgroundColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
                    <Icon name={item.icon} size={24} color={item.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
                        <Text style={{ color: COLORS.slate500, fontSize: 12 }}>{item.time}</Text>
                    </View>
                    <Text style={{ color: COLORS.slate500, marginTop: 4 }}>{item.message}</Text>
                </View>
            </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center', borderBottomWidth: 1 },
  headerTitle: { fontWeight: 'bold', fontSize: 18 },
  item: { flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: 'bold', fontSize: 14 }
});
