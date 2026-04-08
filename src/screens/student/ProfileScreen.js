import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import { COLORS, SPACING, FONTS, RADIUS } from '../../utils/constants';
import { getUserLevel, formatDate } from '../../utils/helpers';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { progress } = useAppContext();

  const level = getUserLevel(progress?.totalPoints || 0);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Nivel {level.level} – {level.title}</Text>
          </View>
        </View>

        {/* Stats */}
        <Card>
          <Text style={styles.cardTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <StatsRow icon="star" label="Puntos totales" value={progress?.totalPoints || 0} />
            <StatsRow icon="flame" label="Racha actual" value={`${progress?.streak || 0} días`} />
            <StatsRow icon="book" label="Lecciones completadas" value={progress?.completedLessons?.length || 0} />
            <StatsRow icon="mic" label="Ejercicios realizados" value={progress?.exerciseHistory?.length || 0} />
          </View>
        </Card>

        {/* Account info */}
        <Card>
          <Text style={styles.cardTitle}>Cuenta</Text>
          <InfoRow icon="person-outline" label="Nombre" value={user?.name} />
          <InfoRow icon="mail-outline" label="Correo" value={user?.email} />
          <InfoRow
            icon="calendar-outline"
            label="Miembro desde"
            value={formatDate(user?.createdAt)}
          />
        </Card>

        {/* Settings */}
        <Card>
          <Text style={styles.cardTitle}>Ajustes</Text>
          <SettingRow icon="notifications-outline" label="Notificaciones" />
          <SettingRow icon="moon-outline" label="Modo oscuro" />
          <SettingRow icon="globe-outline" label="Idioma de la interfaz" value="Español" />
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SpeakUp v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatsRow({ icon, label, value }) {
  return (
    <View style={styles.statsRow}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
      <Text style={styles.statsLabel}>{label}</Text>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.textLight} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SettingRow({ icon, label, value }) {
  return (
    <View style={styles.settingRow}>
      <Ionicons name={icon} size={18} color={COLORS.textLight} style={styles.infoIcon} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value || ''}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarLetter: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.white },
  userName: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.text },
  userEmail: { fontSize: FONTS.sizes.md, color: COLORS.textLight, marginTop: 4 },
  levelBadge: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
  },
  levelBadgeText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '700' },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  statsGrid: { gap: SPACING.sm },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs },
  statsLabel: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textLight, marginLeft: SPACING.sm },
  statsValue: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoIcon: { marginRight: SPACING.sm },
  infoLabel: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textLight },
  infoValue: { fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: '500' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingLabel: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text, marginLeft: SPACING.sm },
  settingValue: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginRight: SPACING.xs },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  logoutText: { fontSize: FONTS.sizes.md, color: COLORS.error, fontWeight: '700', marginLeft: SPACING.sm },
  version: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.lg },
});
