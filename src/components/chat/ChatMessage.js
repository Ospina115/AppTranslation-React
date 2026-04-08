import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../../utils/constants';

export default function ChatMessage({ message }) {
  const isBot = message.isBot;

  return (
    <View style={[styles.container, isBot ? styles.botContainer : styles.userContainer]}>
      {isBot && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isBot ? styles.botTimestamp : styles.userTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
    alignSelf: 'flex-end',
  },
  avatarText: {
    fontSize: 18,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  botBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: RADIUS.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: RADIUS.sm,
  },
  messageText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  botText: {
    color: COLORS.text,
  },
  userText: {
    color: COLORS.white,
  },
  timestamp: {
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
  botTimestamp: {
    color: COLORS.textMuted,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
});
