import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../../utils/constants';
import { getPronunciationFeedback } from '../../utils/helpers';

export default function PronunciationFeedback({ score, recognizedText, expectedPhrase }) {
  const feedback = getPronunciationFeedback(score);

  return (
    <View style={[styles.container, { borderColor: feedback.color }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{feedback.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.feedbackLabel, { color: feedback.color }]}>
            {feedback.label}
          </Text>
          <Text style={[styles.score, { color: feedback.color }]}>{score}%</Text>
        </View>
      </View>

      {recognizedText && (
        <View style={styles.comparisonBox}>
          <View style={styles.comparisonRow}>
            <Ionicons name="volume-high-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.comparisonLabel}>Dijiste:</Text>
            <Text style={styles.comparisonValue} numberOfLines={2}>"{recognizedText}"</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Ionicons name="document-text-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.comparisonLabel}>Esperado:</Text>
            <Text style={styles.comparisonValue} numberOfLines={2}>"{expectedPhrase}"</Text>
          </View>
        </View>
      )}

      {score < 70 && (
        <View style={styles.tipBox}>
          <Ionicons name="bulb-outline" size={14} color={COLORS.warning} />
          <Text style={styles.tipText}>
            Escucha el ejemplo y practica más despacio antes de volver a intentarlo.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emoji: {
    fontSize: 32,
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  feedbackLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  score: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  comparisonBox: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.xs,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  comparisonLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginLeft: 4,
    marginRight: 4,
    minWidth: 60,
  },
  comparisonValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    flex: 1,
    fontStyle: 'italic',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.sm,
    backgroundColor: COLORS.warningLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  tipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    flex: 1,
  },
});
