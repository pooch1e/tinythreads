import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export default function EmptyState({ title, subtitle, actionLabel, onAction, icon = '🧸' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onAction}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  icon: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#888',
    lineHeight: 22,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
