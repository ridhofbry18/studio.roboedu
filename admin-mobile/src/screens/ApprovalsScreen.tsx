import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import { Check, X, ChevronDown } from 'lucide-react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { typography, rounded, shadows, spacing } from '../theme/theme';

export default function ApprovalsScreen() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, teamRes] = await Promise.all([
        api.get('/admin/approvals'),
        api.get('/admin/teams')
      ]);
      if (appRes.data?.data) setApprovals(appRes.data.data);
      if (teamRes.data?.data) setTeams(teamRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (user: any) => {
    setSelectedUser(user);
    setIsTeamModalVisible(true);
  };

  const handleApprove = async (teamId: string) => {
    setIsTeamModalVisible(false);
    if (!selectedUser) return;
    
    try {
      await api.post('/admin/approvals', {
        userId: selectedUser.id,
        action: 'approve',
        role: 'anggota',
        teamId: teamId
      });
      setApprovals(prev => prev.filter(u => u.id !== selectedUser.id));
      Alert.alert('Sukses', 'User disetujui dan dimasukkan ke tim!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Gagal menyetujui user.');
    }
  };

  const handleReject = async (user: any) => {
    try {
      await api.post('/admin/approvals', {
        userId: user.id,
        action: 'reject'
      });
      setApprovals(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userRole}>{item.role} - {item.institution || 'No School'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(item)}>
          <X color={colors.error} size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => openApproveModal(item)}>
          <Check color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={approvals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No pending approvals.</Text>}
        />
      )}

      {/* Team Selection Modal */}
      <Modal
        visible={isTeamModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsTeamModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pilih Tim untuk {selectedUser?.name}</Text>
            <FlatList
              data={teams}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.teamOption} 
                  onPress={() => handleApprove(item.id)}
                >
                  <Text style={styles.teamOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => setIsTeamModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, gap: spacing.sm },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...typography.bodyMd, textAlign: 'center', color: colors.onSurfaceVariant, marginTop: spacing.lg },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, padding: spacing.md, borderRadius: rounded.md, ...shadows.surface1,
  },
  userInfo: { flex: 1 },
  userName: { ...typography.labelMd, color: colors.onSurface, marginBottom: spacing.base },
  userRole: { ...typography.bodySm, color: colors.onSurfaceVariant },
  actions: { flexDirection: 'row', gap: spacing.xs },
  actionBtn: { width: 40, height: 40, borderRadius: rounded.full, justifyContent: 'center', alignItems: 'center' },
  rejectBtn: { backgroundColor: colors.errorContainer },
  approveBtn: { backgroundColor: colors.primaryContainer },
  
  // Modal styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: colors.surface, borderTopLeftRadius: rounded.xl, borderTopRightRadius: rounded.xl,
    padding: spacing.lg, maxHeight: '80%'
  },
  modalTitle: { ...typography.headlineSm, color: colors.onSurface, marginBottom: spacing.md },
  teamOption: {
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.surfaceContainerHigh
  },
  teamOptionText: { ...typography.labelMd, color: colors.onSurface },
  cancelBtn: {
    marginTop: spacing.md, paddingVertical: spacing.sm, alignItems: 'center'
  },
  cancelBtnText: { ...typography.labelMd, color: colors.error }
});
