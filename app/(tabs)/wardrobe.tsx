import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useWardrobe } from '../../src/hooks/useWardrobe';
import ClothingCard from '../../src/components/ClothingCard';
import EmptyState from '../../src/components/EmptyState';
import FilterBar from '../../src/components/FilterBar';
import { CLOTHING_TYPES, CLOTHING_CONFIG } from '../../src/constants/clothing';
import { ClothingColour, ClothingItem, BabySize } from '../../src/types';

export default function WardrobeScreen() {
  const router = useRouter();
  const { items, isLoading, deleteItem, refresh } = useWardrobe();
  const [activeSize, setActiveSize] = useState<BabySize | null>(null);
  const [activeColour, setActiveColour] = useState<ClothingColour | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => !activeSize || item.size === activeSize)
      .filter((item) => !activeColour || item.colour?.hex === activeColour.hex);
  }, [activeColour, activeSize, items]);

  const sections = useMemo(() => {
    return CLOTHING_TYPES.map((type) => ({
      type,
      title: CLOTHING_CONFIG[type].pluralName,
      icon: CLOTHING_CONFIG[type].icon,
      data: [filteredItems.filter((i) => i.type === type)], // SectionList wants array of rows
    })).filter((s) => s.data[0].length > 0);
  }, [filteredItems]);

  const confirmDelete = (item: ClothingItem) => {
    Alert.alert(
      'Remove Item',
      `Remove this ${CLOTHING_CONFIG[item.type].displayName.toLowerCase()} from your wardrobe?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteItem(item.id),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🧺"
        title="Your wardrobe is empty"
        subtitle="Add your first baby clothing item to get started."
        actionLabel="Add Item"
        onAction={() => router.push('/(tabs)/add')}
      />
    );
  }

  return (
    <SectionList
      ListHeaderComponent={
        <FilterBar
          activeSize={activeSize}
          activeColour={activeColour}
          onSizeChange={setActiveSize}
          onColourChange={setActiveColour}
          onClearAll={() => {
            setActiveSize(null);
            setActiveColour(null);
          }}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyFilteredState}>
          <Text style={styles.emptyFilteredTitle}>No items match these filters</Text>
          <Text style={styles.emptyFilteredText}>Try a different size or colour.</Text>
        </View>
      }
      sections={sections}
      keyExtractor={(row, i) => `section-${i}`}
      contentContainerStyle={styles.list}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionCount}>{section.data[0].length}</Text>
        </View>
      )}
      renderItem={({ item: rowItems }) => (
        <View style={styles.row}>
          {(rowItems as ClothingItem[]).map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onLongPress={() => confirmDelete(item)}
            />
          ))}
        </View>
      )}
      stickySectionHeadersEnabled={false}
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
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  sectionCount: {
    fontSize: 13,
    color: '#AAA',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyFilteredState: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyFilteredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptyFilteredText: {
    marginTop: 6,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
