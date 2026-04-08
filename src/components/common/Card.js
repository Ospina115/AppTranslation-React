import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';

export default function Card({ children, style, variant = 'default', padding = true }) {
  return (
    <View
      style={[
        styles.card,
        styles[`card_${variant}`] || styles.card_default,
        !padding && styles.noPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  noPadding: {
    padding: 0,
  },
  card_default: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  card_outlined: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  card_filled: {
    backgroundColor: COLORS.primaryLight,
  },
  card_success: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  card_error: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
});
