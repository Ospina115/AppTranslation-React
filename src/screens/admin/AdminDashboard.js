import React, { useState, useEffect } from 'react';
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
import Card from '../../components/common/Card';
import { COLORS, SPACING, FONTS, RADIUS, ROUTES } from '../../utils/constants';
import authService from '../../services/authService';
import progressService from '../../services/progressService';

export default function AdminDashboard({ navigation }) {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeToday: 0,
    totalExercises: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const users = await authService.getAllUsers();
      const students = users.filter((u) => u.role !== 'admin');
      const allProgress = await progressService.getAllUsersProgress(students.map((s) => s.id));

      const today = new Date().toISOString().split('T')[0];
      let activeToday = 0;
      let totalExercises = 0;
      let totalScore = 0;
      let scoreCount = 0;

      allProgress.forEach((p) => {
        if (p.lastActivityDate === today) activeToday++;
        totalExercises += p.exerciseHistory?.length || 0;
        p.exerciseHistory?.forEach((e) => {
          totalScore += e.score;
          scoreCount++;
        });
      });

      setStats({
        totalStudents: students.length,
        activeToday,
        totalExercises,
        avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      });
    } catch (error) {
      console.error('Load stats error:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Salir del panel de administración?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Panel de Administración</Text>
            <Text style={styles.subtitle}>Resumen general de la plataforma</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        {/* Stats cards */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            color={COLORS.primary}
            label="Estudiantes"
            value={stats.totalStudents}
            loading={loading}
          />
          <StatCard
            icon="pulse"
            color={COLORS.success}
            label="Activos hoy"
            value={stats.activeToday}
            loading={loading}
          />
          <StatCard
            icon="mic"
            color={COLORS.secondary}
            label="Ejercicios totales"
            value={stats.totalExercises}
            loading={loading}
          />
          <StatCard
            icon="star"
            color={COLORS.warning}
            label="Promedio general"
            value={`${stats.avgScore}%`}
            loading={loading}
          />
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          <AdminAction
            icon="people-outline"
            label="Ver Estudiantes"
            description="Lista y gestión de alumnos"
            color={COLORS.primary}
            onPress={() => navigation.navigate(ROUTES.STUDENTS_LIST)}
          />
          <AdminAction
            icon="bar-chart-outline"
            label="Reportes"
            description="Estadísticas de progreso"
            color={COLORS.success}
            onPress={() => navigation.navigate(ROUTES.STUDENTS_LIST)}
          />
          <AdminAction
            icon="refresh-outline"
            label="Actualizar datos"
            description="Recargar estadísticas"
            color={COLORS.secondary}
            onPress={loadStats}
          />
        </View>

        {/* Info section */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>📌 Instrucciones</Text>
          <Text style={styles.infoText}>
            • Usa <Text style={styles.infoHighlight}>Ver Estudiantes</Text> para revisar el progreso individual.{'\n'}
            • Los datos se actualizan en tiempo real desde el almacenamiento local.{'\n'}
            • Para producción, conectar con backend Firebase/Supabase.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, color, label, value, loading }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{loading ? '...' : value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AdminAction({ icon, label, description, color, onPress }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.actionInfo}>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionDesc}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    margin: -SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  greeting: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.white },
  subtitle: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  logoutBtn: { padding: SPACING.sm, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: { width: 46, height: 46, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  statValue: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  actionsGrid: { gap: SPACING.sm, marginBottom: SPACING.md },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIcon: { width: 46, height: 46, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  actionInfo: { flex: 1 },
  actionLabel: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  actionDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginTop: 2 },
  infoCard: { backgroundColor: COLORS.primaryLight },
  infoTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm },
  infoText: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 22 },
  infoHighlight: { fontWeight: '700', color: COLORS.primary },
});
