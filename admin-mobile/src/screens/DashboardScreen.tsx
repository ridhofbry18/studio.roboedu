import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Users, School, Clock, LogOut } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { typography, rounded, shadows, spacing } from '../theme/theme';

export default function DashboardScreen() {
  const { signOut } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalTeams: 0, totalSchools: 0, pendingUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon color={colors.primary} size={24} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Admin</Text>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <LogOut color={colors.onSurfaceVariant} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <StatCard title="TOTAL TEAMS" value={stats.totalTeams} icon={Users} />
        <StatCard title="TOTAL SCHOOLS" value={stats.totalSchools} icon={School} />
        <StatCard title="PENDING USERS" value={stats.pendingUsers} icon={Clock} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  greeting: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  logoutBtn: {
    padding: spacing.xs,
  },
  grid: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: rounded.lg,
    ...shadows.surface1, // no border, just shadow
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: rounded.full,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  statValue: {
    ...typography.headlineMd,
    color: colors.onSurface,
  }
});
