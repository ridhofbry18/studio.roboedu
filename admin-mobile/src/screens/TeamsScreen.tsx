import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Settings, Plus, ChevronDown, ChevronUp, UserPlus, X } from 'lucide-react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { typography, rounded, shadows, spacing } from '../theme/theme';

export default function TeamsScreen() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Record<string, any[]>>({});

  // Modal Create Team
  const [isTeamModal, setIsTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');

  // Modal Bypass Add User
  const [isUserModal, setIsUserModal] = useState(false);
  const [targetTeam, setTargetTeam] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/admin/teams');
      if (response.data?.data) {
        setTeams(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (teamId: string) => {
    try {
      const response = await api.get(`/admin/teams/${teamId}/members`);
      if (response.data?.data) {
        setTeamMembers(prev => ({ ...prev, [teamId]: response.data.data }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (teamId: string) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
      if (!teamMembers[teamId]) {
        fetchMembers(teamId);
      }
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName) return Alert.alert('Error', 'Nama tim wajib diisi!');
    try {
      await api.post('/admin/teams', { name: teamName, description: teamDesc });
      setIsTeamModal(false);
      setTeamName(''); setTeamDesc('');
      fetchTeams();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Gagal membuat tim');
    }
  };

  const handleAddUser = async () => {
    if (!userName || !userEmail || !targetTeam) return Alert.alert('Error', 'Nama dan Email wajib diisi!');
    try {
      await api.post('/admin/users', { name: userName, email: userEmail, role: 'anggota', teamId: targetTeam });
      setIsUserModal(false);
      setUserName(''); setUserEmail('');
      fetchMembers(targetTeam); // refresh members
      Alert.alert('Sukses', 'Anggota berhasil ditambahkan ke tim!');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Gagal menambahkan anggota');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isExpanded = expandedTeam === item.id;
    const members = teamMembers[item.id] || [];

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand(item.id)}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamDesc} numberOfLines={1}>{item.description}</Text>
          </View>
          {isExpanded ? <ChevronUp color={colors.outline} size={20} /> : <ChevronDown color={colors.outline} size={20} />}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.membersContainer}>
            {members.length === 0 ? (
              <Text style={styles.emptyMembersText}>Belum ada anggota.</Text>
            ) : (
              members.map((m: any) => (
                <View key={m.id} style={styles.memberRow}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberEmail}>{m.email}</Text>
                </View>
              ))
            )}
            
            <TouchableOpacity 
              style={styles.addMemberBtn} 
              onPress={() => { setTargetTeam(item.id); setIsUserModal(true); }}
            >
              <UserPlus color={colors.primary} size={16} style={{marginRight: 8}}/>
              <Text style={styles.addMemberText}>Bypass Add Member</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No teams found.</Text>}
        />
      )}
      
      <TouchableOpacity style={styles.fab} onPress={() => setIsTeamModal(true)}>
        <Plus color={colors.onPrimary} size={24} />
      </TouchableOpacity>

      {/* Modal Create Team */}
      <Modal visible={isTeamModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buat Tim Baru</Text>
              <TouchableOpacity onPress={() => setIsTeamModal(false)}>
                <X color={colors.onSurface} size={24} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Nama Tim" value={teamName} onChangeText={setTeamName} placeholderTextColor={colors.outlineVariant} />
            <TextInput style={styles.input} placeholder="Deskripsi Singkat" value={teamDesc} onChangeText={setTeamDesc} placeholderTextColor={colors.outlineVariant} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTeam}>
              <Text style={styles.submitBtnText}>Simpan Tim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Add User Bypass */}
      <Modal visible={isUserModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bypass Add Anggota</Text>
              <TouchableOpacity onPress={() => setIsUserModal(false)}>
                <X color={colors.onSurface} size={24} />
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 12, color: colors.error, marginBottom: 12}}>User ini akan otomatis berstatus Active!</Text>
            <TextInput style={styles.input} placeholder="Nama Lengkap" value={userName} onChangeText={setUserName} placeholderTextColor={colors.outlineVariant} />
            <TextInput style={styles.input} placeholder="Email User (Google)" value={userEmail} onChangeText={setUserEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.outlineVariant} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddUser}>
              <Text style={styles.submitBtnText}>Tambahkan Sekarang</Text>
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
  
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: rounded.md,
    ...shadows.surface1,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md,
  },
  teamInfo: { flex: 1 },
  teamName: { ...typography.labelMd, color: colors.onSurface },
  teamDesc: { ...typography.bodySm, color: colors.onSurfaceVariant },
  
  membersContainer: {
    padding: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  memberName: { ...typography.labelMd, color: colors.onSurface },
  memberEmail: { ...typography.bodySm, color: colors.onSurfaceVariant },
  emptyMembersText: { ...typography.bodySm, color: colors.outline, fontStyle: 'italic', marginBottom: spacing.xs },
  
  addMemberBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.primaryContainer, borderRadius: rounded.sm
  },
  addMemberText: { ...typography.labelMd, color: colors.onPrimaryContainer },

  fab: {
    position: 'absolute', right: spacing.lg, bottom: spacing.lg,
    width: 56, height: 56, borderRadius: rounded.full,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    ...shadows.surface2,
  },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.lg },
  modalContent: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: rounded.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.headlineSm, color: colors.onSurface },
  input: {
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: rounded.sm,
    padding: spacing.sm, marginBottom: spacing.md, ...typography.bodyMd, color: colors.onSurface
  },
  submitBtn: {
    backgroundColor: colors.primary, padding: spacing.sm, borderRadius: rounded.sm, alignItems: 'center'
  },
  submitBtnText: { color: colors.onPrimary, ...typography.labelMd }
});
