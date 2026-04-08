import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../../utils/constants';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) {
  const variantStyle = styles[`btn_${variant}`] || styles.btn_primary;
  const textVariantStyle = styles[`text_${variant}`] || styles.text_primary;
  const sizeStyle = styles[`size_${size}`] || styles.size_md;
  const textSizeStyle = styles[`textSize_${size}`] || styles.textSize_md;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle,
        sizeStyle,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={[styles.text, textVariantStyle, textSizeStyle, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: SPACING.sm,
  },
  text: {
    fontWeight: '700',
  },
  // Variants
  btn_primary: {
    backgroundColor: COLORS.primary,
  },
  btn_secondary: {
    backgroundColor: COLORS.secondary,
  },
  btn_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  btn_ghost: {
    backgroundColor: 'transparent',
  },
  btn_danger: {
    backgroundColor: COLORS.error,
  },
  btn_success: {
    backgroundColor: COLORS.success,
  },
  // Text variants
  text_primary: { color: COLORS.white },
  text_secondary: { color: COLORS.white },
  text_outline: { color: COLORS.primary },
  text_ghost: { color: COLORS.primary },
  text_danger: { color: COLORS.white },
  text_success: { color: COLORS.white },
  // Sizes
  size_sm: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md },
  size_md: { paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.lg },
  size_lg: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
  // Text sizes
  textSize_sm: { fontSize: FONTS.sizes.sm },
  textSize_md: { fontSize: FONTS.sizes.md },
  textSize_lg: { fontSize: FONTS.sizes.lg },
  // Disabled
  disabled: { opacity: 0.5 },
});
