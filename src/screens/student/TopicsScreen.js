import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import ProgressBar from '../../components/common/ProgressBar';
import { COLORS, SPACING, FONTS, RADIUS, ROUTES, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../utils/constants';
import { getAvailableTopics } from '../../data/topics';
import { getLessonsForTopic } from '../../data/exercises';

export default function TopicsScreen({ navigation }) {
  const { progress, getTopicProgress } = useAppContext();

  const completedTopicIds = progress?.completedTopics || [];
  const topics = getAvailableTopics(completedTopicIds);

  const renderTopic = ({ item: topic }) => {
    const topicProgress = getTopicProgress(topic.id);
    const lessons = getLessonsForTopic(topic.id);
    const completedCount = topicProgress?.completedLessons?.length || 0;
    const totalCount = lessons.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
      <TouchableOpacity
        style={[styles.topicCard, !topic.unlocked && styles.topicLocked]}
        onPress={() => {
          if (topic.unlocked) {
            navigation.navigate(ROUTES.LESSON, {
              topicId: topic.id,
              topicTitle: topic.title,
              lessonTitle: topic.title,
            });
          }
        }}
        activeOpacity={topic.unlocked ? 0.8 : 1}
      >
        {/* Header */}
        <View style={styles.topicHeader}>
          <View style={[styles.iconContainer, { backgroundColor: topic.color + '20' }]}>
            <Text style={styles.topicIcon}>{topic.icon}</Text>
          </View>
          <View style={styles.topicMeta}>
            <View style={styles.topicTitleRow}>
              <Text style={styles.topicTitle} numberOfLines={1}>{topic.title}</Text>
              {!topic.unlocked && (
                <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} />
              )}
            </View>
            <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[topic.difficulty] + '20' }]}>
              <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[topic.difficulty] }]}>
                {DIFFICULTY_LABELS[topic.difficulty]}
              </Text>
            </View>
          </View>
          {progressPercent === 100 && (
            <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
          )}
        </View>

        <Text style={styles.topicDesc} numberOfLines={2}>{topic.description}</Text>

        {/* Progress */}
        {topic.unlocked && (
          <View style={styles.progressSection}>
            <ProgressBar
              progress={progressPercent}
              height={6}
              color={topic.color}
              showLabel
              label={`${completedCount}/${totalCount} lecciones`}
            />
          </View>
        )}

        {!topic.unlocked && (
          <Text style={styles.lockedText}>
            Completa los temas anteriores para desbloquear
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const groupByDifficulty = (topicList) => {
    const groups = {};
    topicList.forEach((t) => {
      if (!groups[t.difficulty]) groups[t.difficulty] = [];
      groups[t.difficulty].push(t);
    });
    return groups;
  };

  const groups = groupByDifficulty(topics);
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={difficulties}
        keyExtractor={(d) => d}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: difficulty }) => {
          const group = groups[difficulty];
          if (!group || group.length === 0) return null;
          return (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: DIFFICULTY_COLORS[difficulty] }]} />
                <Text style={styles.sectionTitle}>{DIFFICULTY_LABELS[difficulty]}</Text>
              </View>
              {group.map((topic) => (
                <React.Fragment key={topic.id}>
                  {renderTopic({ item: topic })}
                </React.Fragment>
              ))}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  section: { marginBottom: SPACING.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  sectionDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  topicCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  topicLocked: { opacity: 0.65 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  topicIcon: { fontSize: 24 },
  topicMeta: { flex: 1 },
  topicTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  topicTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, flex: 1 },
  diffBadge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, marginTop: 4 },
  diffText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  topicDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginBottom: SPACING.sm, lineHeight: 20 },
  progressSection: { marginTop: SPACING.xs },
  lockedText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontStyle: 'italic' },
});
