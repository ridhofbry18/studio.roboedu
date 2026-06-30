import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { typography, rounded, shadows, spacing } from '../theme/theme';

export default function SchoolsScreen() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/admin/schools');
      if (response.data && response.data.data) {
        setSchools(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.schoolName}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACTIVE</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.assignBtn}>
        <Text style={styles.assignText}>Assign Team</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={schools}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No schools found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    textAlign: 'center',
    color: colors.onSurfaceVariant,
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: rounded.lg,
    ...shadows.surface1,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  schoolName: {
    ...typography.labelMd,
    color: colors.onSurface,
    flex: 1,
    marginRight: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.base,
    borderRadius: rounded.full,
  },
  badgeText: {
    color: colors.onPrimaryFixedVariant,
    ...typography.labelSm,
  },
  assignBtn: {
    backgroundColor: colors.secondaryFixed,
    paddingVertical: 10,
    borderRadius: rounded.DEFAULT,
    alignItems: 'center',
  },
  assignText: {
    color: colors.onSecondaryFixedVariant,
    ...typography.labelMd,
  }
});
