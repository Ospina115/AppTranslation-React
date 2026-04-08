import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../../utils/constants';

export default function ProgressBar({
  progress = 0,
  height = 10,
  color = COLORS.primary,
  backgroundColor = COLORS.border,
  showLabel = false,
  label,
  style,
}) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={style}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label || `${clampedProgress}%`}</Text>
          <Text style={styles.percentText}>{clampedProgress}%</Text>
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              height,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: RADIUS.full,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  labelText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  percentText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
