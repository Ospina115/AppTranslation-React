import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { COLORS, SPACING, FONTS, RADIUS, ROUTES } from '../../utils/constants';
import { getUserLevel } from '../../utils/helpers';
import { TOPICS } from '../../data/topics';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { progress } = useAppContext();

  const level = getUserLevel(progress?.totalPoints || 0);
  const levelProgress = progress
    ? level.next
      ? Math.round(((progress.totalPoints - getPrevLevelPoints(level.level)) / (level.next - getPrevLevelPoints(level.level))) * 100)
      : 100
    : 0;

  const recentTopics = TOPICS.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              👋 Hola, {user?.name?.split(' ')[0] || 'Estudiante'}
            </Text>
            <Text style={styles.subtitle}>¿Listo para practicar hoy?</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{progress?.streak || 0}</Text>
          </View>
        </View>

        {/* Level Card */}
        <Card style={styles.levelCard}>
          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{level.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Nivel {level.level} – {level.title}</Text>
              <Text style={styles.levelPoints}>{progress?.totalPoints || 0} puntos totales</Text>
              <ProgressBar
                progress={levelProgress}
                height={8}
                color={COLORS.secondary}
                style={{ marginTop: SPACING.xs }}
              />
              {level.next && (
                <Text style={styles.levelNextText}>
                  {level.next - (progress?.totalPoints || 0)} puntos para el siguiente nivel
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard icon="book" label="Lecciones" value={progress?.completedLessons?.length || 0} />
          <StatCard icon="flame" label="Racha" value={`${progress?.streak || 0} días`} />
          <StatCard icon="star" label="Puntos" value={progress?.totalPoints || 0} />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acción Rápida</Text>
        <View style={styles.actionsRow}>
          <QuickAction
            icon="chatbubbles"
            label="Chatbot IA"
            color={COLORS.primary}
            onPress={() => navigation.navigate(ROUTES.CHATBOT)}
          />
          <QuickAction
            icon="book"
            label="Ver Temas"
            color={COLORS.secondary}
            onPress={() => navigation.navigate('TopicsTab')}
          />
          <QuickAction
            icon="bar-chart"
            label="Mi Progreso"
            color={COLORS.success}
            onPress={() => navigation.navigate(ROUTES.PROGRESS)}
          />
        </View>

        {/* Recent Topics */}
        <Text style={styles.sectionTitle}>Continúa Aprendiendo</Text>
        {recentTopics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicItem}
            onPress={() => navigation.navigate('TopicsTab', { screen: ROUTES.TOPICS })}
            activeOpacity={0.8}
          >
            <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
              <Text style={styles.topicEmoji}>{topic.icon}</Text>
            </View>
            <View style={styles.topicInfo}>
              <Text style={styles.topicName}>{topic.title}</Text>
              <Text style={styles.topicDesc} numberOfLines={1}>{topic.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function getPrevLevelPoints(level) {
  const map = { 1: 0, 2: 100, 3: 300, 4: 600, 5: 1000, 6: 1500 };
  return map[level] || 0;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  greeting: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: FONTS.sizes.md, color: COLORS.textLight, marginTop: 2 },
  streakBadge: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    minWidth: 56,
  },
  streakIcon: { fontSize: 22 },
  streakCount: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.secondary },
  levelCard: { backgroundColor: COLORS.primary, marginBottom: SPACING.md },
  levelRow: { flexDirection: 'row', alignItems: 'center' },
  levelBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  levelNumber: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.white },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.white },
  levelPoints: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  levelNextText: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 2 },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  actionsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  actionLabel: { fontSize: FONTS.sizes.xs, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  topicIcon: { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  topicEmoji: { fontSize: 22 },
  topicInfo: { flex: 1 },
  topicName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  topicDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginTop: 2 },
});
