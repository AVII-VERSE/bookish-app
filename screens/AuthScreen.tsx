
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenName } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS } from '../theme';

interface AuthScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDark?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, isDark = true }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const textColor = isDark ? COLORS.textDark : COLORS.textLight;
  const bgColor = isDark ? COLORS.backgroundDark : COLORS.backgroundLight;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: bgColor }]} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Icon name="auto-stories" size={40} color={COLORS.primary} />
          <Text style={[styles.brand, { color: textColor }]}>Bookish</Text>
          <Text style={styles.tagline}>Your Next Chapter Awaits.</Text>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'signup' && { backgroundColor: isDark ? COLORS.backgroundDark : '#FFF' }]}
            onPress={() => setMode('signup')}
          >
            <Text style={{ color: mode === 'signup' ? textColor : COLORS.slate500 }}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'login' && { backgroundColor: isDark ? COLORS.backgroundDark : '#FFF' }]}
            onPress={() => setMode('login')}
          >
            <Text style={{ color: mode === 'login' ? textColor : COLORS.slate500 }}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {mode === 'signup' && (
              <Input label="Full Name" placeholder="Enter your full name" isDark={isDark} />
          )}
          <Input label="Email" placeholder="Enter your email address" keyboardType="email-address" isDark={isDark} />
          <Input label="Password" placeholder="Enter your password" secureTextEntry icon="visibility" isDark={isDark} />
          
          {mode === 'login' && (
              <TouchableOpacity style={styles.forgotPass}>
                <Text style={{ color: COLORS.primary }}>Forgot password?</Text>
              </TouchableOpacity>
          )}

          <Button onPress={() => onNavigate(ScreenName.DASHBOARD)} fullWidth style={{ marginTop: 16 }}>
              {mode === 'signup' ? 'Create Account' : 'Log In'}
          </Button>
        </View>

        <View style={styles.divider}>
          <View style={[styles.line, { backgroundColor: COLORS.slate400 }]} />
          <Text style={[styles.orText, { backgroundColor: bgColor }]}>or continue with</Text>
        </View>

        <View style={styles.socials}>
          <TouchableOpacity style={[styles.socialBtn, { borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
            <Text style={{ color: isDark ? '#FFF' : '#000' }}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, { borderColor: isDark ? COLORS.slate800 : COLORS.slate200 }]}>
             <Text style={{ color: isDark ? '#FFF' : '#000' }}>Apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 32 },
  brand: { fontSize: 30, fontWeight: 'bold', marginVertical: 8 },
  tagline: { fontSize: 16, fontStyle: 'italic', color: COLORS.slate500 },
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.slate200, padding: 4, borderRadius: 8, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  form: { width: '100%' },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32, position: 'relative' },
  line: { flex: 1, height: 1 },
  orText: { position: 'absolute', left: '35%', width: '30%', textAlign: 'center', color: COLORS.slate500 },
  socials: { gap: 12 },
  socialBtn: { height: 50, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }
});
