import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useModelStatus } from '../hooks/useModelStatus';

/**
 * A small spinner shown in the tab bar header area while the ONNX model
 * is downloading or loading. Hides itself once the model is ready.
 */
export default function ModelStatusBar() {
  const { status } = useModelStatus();

  if (status === 'ready' || status === 'idle' || status === 'error') return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 12,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
