import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { COLORS, SPACING, FONTS, RADIUS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../utils/constants';
import progressService from '../../services/progressService';
import { getUserLevel, formatDate } from '../../utils/helpers';
import { TOPICS } from '../../data/topics';

export default function StudentDetailScreen({ route }) {
  const { studentId, studentName } = route.params || {};
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [studentId]);

  const loadProgress = async () => {
    setLoading(true);
    const p = await progressService.getUserProgress(studentId);
    setProgress(p);
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const level = getUserLevel(progress?.totalPoints || 0);
  const recentHistory = progress?.exerciseHistory?.slice(0, 15) || [];

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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Student Header */}
        <View style={styles.studentHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{studentName?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <Text style={styles.studentName}>{studentName}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Nivel {level.level} – {level.title}</Text>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.statsGrid}>
          <MiniStat icon="star" color={COLORS.secondary} label="Puntos" value={progress?.totalPoints || 0} />
          <MiniStat icon="flame" color={COLORS.error} label="Racha" value={`${progress?.streak || 0}d`} />
          <MiniStat icon="book" color={COLORS.primary} label="Lecciones" value={progress?.completedLessons?.length || 0} />
          <MiniStat icon="mic" color={COLORS.success} label="Ejercicios" value={progress?.exerciseHistory?.length || 0} />
        </View>

        {/* Level Progress */}
        <Card>
          <Text style={styles.cardTitle}>Progreso de Nivel</Text>
          <View style={styles.levelRow}>
            <View style={styles.levelCircle}>
              <Text style={styles.levelNumber}>{level.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>{level.title}</Text>
              <ProgressBar
                progress={
                  level.next
                    ? Math.round(
                        ((progress?.totalPoints - getPrevPoints(level.level)) /
                          (level.next - getPrevPoints(level.level))) *
                          100
                      )
                    : 100
                }
                height={8}
                color={COLORS.secondary}
                showLabel
                label={`${progress?.totalPoints} puntos`}
                style={{ marginTop: SPACING.xs }}
              />
              {level.next && (
                <Text style={styles.nextLevelText}>
                  Faltan {level.next - (progress?.totalPoints || 0)} puntos para el nivel {level.level + 1}
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Last activity */}
        {progress?.lastActivityDate && (
          <Card style={styles.lastActivityCard}>
            <Ionicons name="time-outline" size={16} color={COLORS.primary} />
            <Text style={styles.lastActivityText}>
              Última actividad: <Text style={styles.lastActivityDate}>{formatDate(progress.lastActivityDate)}</Text>
            </Text>
          </Card>
        )}

        {/* Topics Progress */}
        {topicStats.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Progreso por Temas</Text>
            {topicStats.map((topic) => (
              <Card key={topic.id} style={styles.topicCard}>
                <View style={styles.topicHeader}>
                  <Text style={styles.topicEmoji}>{topic.icon}</Text>
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicName}>{topic.title}</Text>
                    <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[topic.difficulty] + '20' }]}>
                      <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[topic.difficulty] }]}>
                        {DIFFICULTY_LABELS[topic.difficulty]}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(topic.averageScore) }]}>
                      {topic.averageScore}%
                    </Text>
                    <Text style={styles.scoreLabel}>promedio</Text>
                  </View>
                </View>
                <Text style={styles.topicMeta}>
                  {topic.exercisesCount} ejercicios • {topic.completedLessons} lecciones
                </Text>
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

        {/* Recent exercises */}
        {recentHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            {recentHistory.map((entry) => {
              const topic = TOPICS.find((t) => t.id === entry.topicId);
              return (
                <View key={entry.id} style={styles.historyRow}>
                  <View style={[styles.historyIcon, { backgroundColor: (topic?.color || COLORS.primary) + '15' }]}>
                    <Text>{topic?.icon || '📚'}</Text>
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTopic}>{topic?.title || 'Ejercicio'}</Text>
                    <Text style={styles.historyDate}>{formatDate(entry.completedAt)}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={[styles.historyScore, { color: getScoreColor(entry.score) }]}>
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
          <Card style={styles.noActivityCard}>
            <Text style={styles.noActivityEmoji}>📭</Text>
            <Text style={styles.noActivityText}>Este estudiante aún no ha realizado actividades.</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ icon, color, label, value }) {
  return (
    <View style={styles.miniStat}>
      <View style={[styles.miniStatIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  studentHeader: { alignItems: 'center', paddingVertical: SPACING.lg },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  avatarLetter: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.white },
  studentName: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.text },
  levelBadge: { marginTop: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: 4, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full },
  levelBadgeText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  miniStat: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  miniStatIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  miniStatValue: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  miniStatLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 2 },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  levelRow: { flexDirection: 'row', alignItems: 'center' },
  levelCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  levelNumber: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  nextLevelText: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 4 },
  lastActivityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, gap: SPACING.sm },
  lastActivityText: { fontSize: FONTS.sizes.sm, color: COLORS.text },
  lastActivityDate: { fontWeight: '700', color: COLORS.primary },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.xs },
  topicCard: { marginBottom: SPACING.sm },
  topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  topicEmoji: { fontSize: 22, marginRight: SPACING.sm },
  topicInfo: { flex: 1 },
  topicName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  diffBadge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, marginTop: 2 },
  diffText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  topicMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginBottom: 4 },
  scoreBox: { alignItems: 'center' },
  scoreValue: { fontSize: FONTS.sizes.lg, fontWeight: '800' },
  scoreLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  historyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  historyIcon: { width: 38, height: 38, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  historyInfo: { flex: 1 },
  historyTopic: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  historyDate: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 2 },
  historyRight: { alignItems: 'flex-end' },
  historyScore: { fontSize: FONTS.sizes.md, fontWeight: '700' },
  historyPoints: { fontSize: FONTS.sizes.xs, color: COLORS.success, fontWeight: '600' },
  noActivityCard: { alignItems: 'center', padding: SPACING.xl },
  noActivityEmoji: { fontSize: 40, marginBottom: SPACING.md },
  noActivityText: { fontSize: FONTS.sizes.md, color: COLORS.textLight, textAlign: 'center' },
});
