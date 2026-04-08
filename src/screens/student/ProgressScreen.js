import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { COLORS, SPACING, FONTS, RADIUS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../utils/constants';
import { getUserLevel, formatDate } from '../../utils/helpers';
import { TOPICS } from '../../data/topics';

export default function ProgressScreen() {
  const { user } = useAuth();
  const { progress } = useAppContext();

  const totalPoints = progress?.totalPoints || 0;
  const level = getUserLevel(totalPoints);
  const recentHistory = progress?.exerciseHistory?.slice(0, 10) || [];

  const topicStats = TOPICS.map((topic) => {
    const tp = progress?.topicsProgress?.[topic.id];
    return {
      ...topic,
      completedLessons: tp?.completedLessons?.length || 0,
      averageScore: tp?.averageScore || 0,
      exercisesCount: tp?.exercisesCount || 0,
    };
  }).filter((t) => t.exercisesCount > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Mi Progreso</Text>

        {/* Level Overview */}
        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{level.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Nivel {level.level} – {level.title}</Text>
              <Text style={styles.levelPoints}>{totalPoints} puntos totales</Text>
            </View>
          </View>
          {level.next && (
            <ProgressBar
              progress={Math.round(((totalPoints - getPrevPoints(level.level)) / (level.next - getPrevPoints(level.level))) * 100)}
              height={10}
              color={COLORS.secondary}
              showLabel
              label={`Hacia nivel ${level.level + 1}`}
              style={{ marginTop: SPACING.sm }}
            />
          )}
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatItem icon="flame" color={COLORS.error} label="Racha" value={`${progress?.streak || 0} días`} />
          <StatItem icon="book" color={COLORS.primary} label="Lecciones" value={progress?.completedLessons?.length || 0} />
          <StatItem icon="mic" color={COLORS.success} label="Ejercicios" value={progress?.exerciseHistory?.length || 0} />
          <StatItem icon="trophy" color={COLORS.secondary} label="Puntos" value={totalPoints} />
        </View>

        {/* Topics Progress */}
        {topicStats.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Progreso por Tema</Text>
            {topicStats.map((topic) => (
              <Card key={topic.id} style={styles.topicCard}>
                <View style={styles.topicHeader}>
                  <Text style={styles.topicIcon}>{topic.icon}</Text>
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicName}>{topic.title}</Text>
                    <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[topic.difficulty] + '20' }]}>
                      <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[topic.difficulty] }]}>
                        {DIFFICULTY_LABELS[topic.difficulty]}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.topicScore}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(topic.averageScore) }]}>
                      {topic.averageScore}%
                    </Text>
                    <Text style={styles.scoreLabel}>promedio</Text>
                  </View>
                </View>
                <View style={styles.topicStats}>
                  <Text style={styles.topicStatText}>
                    {topic.exercisesCount} ejercicios • {topic.completedLessons} lecciones completadas
                  </Text>
                </View>
                <ProgressBar
                  progress={topic.averageScore}
                  height={6}
                  color={topic.color}
                  style={{ marginTop: SPACING.xs }}
                />
              </Card>
            ))}
          </>
        )}

        {/* Recent Activity */}
        {recentHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            {recentHistory.map((entry) => {
              const topic = TOPICS.find((t) => t.id === entry.topicId);
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={[styles.historyIcon, { backgroundColor: (topic?.color || COLORS.primary) + '20' }]}>
                    <Text style={styles.historyEmoji}>{topic?.icon || '📚'}</Text>
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTopic}>{topic?.title || 'Ejercicio'}</Text>
                    <Text style={styles.historyDate}>{formatDate(entry.completedAt)}</Text>
                  </View>
                  <View style={styles.historyScore}>
                    <Text style={[styles.historyScoreValue, { color: getScoreColor(entry.score) }]}>
                      {entry.score}%
                    </Text>
                    <Text style={styles.historyPoints}>+{entry.pointsEarned}pts</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {!topicStats.length && !recentHistory.length && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyTitle}>¡Comienza a aprender!</Text>
            <Text style={styles.emptySubtitle}>
              Completa ejercicios para ver tu progreso aquí.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ icon, color, label, value }) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function getScoreColor(score) {
  if (score >= 90) return COLORS.success;
  if (score >= 70) return COLORS.warning;
  return COLORS.error;
}

function getPrevPoints(level) {
  const map = { 1: 0, 2: 100, 3: 300, 4: 600, 5: 1000, 6: 1500 };
  return map[level] || 0;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  pageTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  levelCard: { backgroundColor: COLORS.primary, marginBottom: SPACING.md },
  levelHeader: { flexDirection: 'row', alignItems: 'center' },
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
  levelTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },
  levelPoints: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  statItem: {
    width: '47%',
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
  statIcon: { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xs },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 2 },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.xs },
  topicCard: { marginBottom: SPACING.sm },
  topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  topicIcon: { fontSize: 24, marginRight: SPACING.sm },
  topicInfo: { flex: 1 },
  topicName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  diffBadge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, marginTop: 2 },
  diffText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  topicScore: { alignItems: 'center' },
  scoreValue: { fontSize: FONTS.sizes.lg, fontWeight: '800' },
  scoreLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  topicStats: { marginTop: 4 },
  topicStatText: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  historyIcon: { width: 40, height: 40, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  historyEmoji: { fontSize: 20 },
  historyInfo: { flex: 1 },
  historyTopic: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  historyDate: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 2 },
  historyScore: { alignItems: 'flex-end' },
  historyScoreValue: { fontSize: FONTS.sizes.md, fontWeight: '700' },
  historyPoints: { fontSize: FONTS.sizes.xs, color: COLORS.success, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyEmoji: { fontSize: 56, marginBottom: SPACING.md },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  emptySubtitle: { fontSize: FONTS.sizes.md, color: COLORS.textLight, textAlign: 'center' },
});
