import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image as ImageIcon, Upload } from 'lucide-react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { typography, rounded, shadows, spacing } from '../theme/theme';

export default function MediaVaultScreen() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await api.get('/admin/media');
      if (response.data && response.data.data) {
        setMedia(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <ImageIcon color={colors.primary} size={32} />
      </View>
      <Text style={styles.fileName} numberOfLines={1}>{item.filename}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.uploadBtn}>
          <Upload color={colors.onPrimary} size={20} style={{ marginRight: spacing.xs }} />
          <Text style={styles.uploadText}>Upload Media</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={media}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={styles.emptyText}>No media found.</Text>}
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
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.surface1, // Header elevation
    zIndex: 1, // for shadow visibility on iOS
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: rounded.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: colors.onPrimary,
    ...typography.labelMd,
  },
  list: {
    padding: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: rounded.md,
    alignItems: 'center',
    ...shadows.surface1,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: rounded.lg,
    backgroundColor: colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  fileName: {
    ...typography.bodySm,
    color: colors.onSurface,
    textAlign: 'center',
  }
});
