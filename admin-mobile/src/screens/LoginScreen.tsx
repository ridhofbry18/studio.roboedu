import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { typography, rounded, shadows, spacing } from '../theme/theme';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        await signIn(response.data.token);
      } else {
        Alert.alert('Login Failed', 'Invalid credentials or no token received');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>RoboEdu Admin</Text>
        
        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <TextInput 
          style={styles.input}
          placeholder="admin@roboedu.com"
          placeholderTextColor={colors.outline}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput 
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={colors.outline}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.lg, // 16px
    padding: spacing.lg, // 24px
    ...shadows.surface2,
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: rounded.DEFAULT, // 8px
    paddingHorizontal: spacing.sm, // 12px
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    color: colors.onSurface,
    ...typography.bodyMd,
  },
  button: {
    height: 48,
    backgroundColor: colors.primary, // sky blue interaction
    borderRadius: rounded.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  buttonText: {
    color: colors.onPrimary,
    ...typography.labelMd,
  }
});
