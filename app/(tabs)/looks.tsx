import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useLooks } from '../../src/hooks/useLooks';
import { useWardrobe } from '../../src/hooks/useWardrobe';
import LookCard from '../../src/components/LookCard';
import EmptyState from '../../src/components/EmptyState';
import { MAX_LOOKS } from '../../src/types';

export default function LooksScreen() {
  const router = useRouter();
  const { looks, isLoading, deleteLook, refresh: refreshLooks } = useLooks();
  const { items, refresh: refreshItems } = useWardrobe();

  useFocusEffect(
    useCallback(() => {
      refreshLooks();
      refreshItems();
    }, [refreshLooks, refreshItems]),
  );

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(`Delete "${name}"?`, 'This look will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteLook(id) },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (looks.length === 0) {
    return (
      <EmptyState
        icon="📸"
        title="No saved looks yet"
        subtitle="Head to the Builder tab to mix and match outfits, then save your favourites."
        actionLabel="Open Builder"
        onAction={() => router.push('/(tabs)/builder')}
      />
    );
  }

  return (
    <FlatList
      data={looks}
      keyExtractor={(l) => l.id}
      contentContainerStyle={styles.list}
      renderItem={({ item: look }) => (
        <LookCard
          look={look}
          items={items}
          onDelete={() => confirmDelete(look.id, look.name)}
        />
      )}
      ListFooterComponent={
        looks.length >= MAX_LOOKS ? (
          <View style={styles.footer}>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});
