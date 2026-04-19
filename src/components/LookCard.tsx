import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { SavedLook, ClothingItem, ClothingType } from '../types';
import { CLOTHING_TYPES, CLOTHING_CONFIG } from '../constants/clothing';

interface Props {
  look: SavedLook;
  items: ClothingItem[];
  onDelete: () => void;
}

export default function LookCard({ look, items, onDelete }: Props) {
  const itemMap: Partial<Record<ClothingType, ClothingItem>> = {};
  for (const type of CLOTHING_TYPES) {
    const id = look.itemIds[type];
    if (id) {
      const found = items.find((i) => i.id === id);
      if (found) itemMap[type] = found;
    }
  }

  const date = new Date(look.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{look.name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
          hitSlop={8}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </Pressable>
      </View>

      <View style={styles.items}>
        {CLOTHING_TYPES.map((type) => {
          const item = itemMap[type];
          const config = CLOTHING_CONFIG[type];
          return (
            <View key={type} style={styles.itemSlot}>
              {item ? (
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.itemImage}
                  contentFit="contain"
                  transition={100}
                />
              ) : (
                <View style={styles.itemPlaceholder}>
                  <Text style={styles.itemPlaceholderIcon}>{config.icon}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
  },
  deleteBtnPressed: {
    opacity: 0.6,
  },
  deleteBtnText: {
    fontSize: 12,
    color: '#D00',
    fontWeight: '500',
  },
  items: {
    flexDirection: 'row',
    gap: 8,
  },
  itemSlot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPlaceholderIcon: {
    fontSize: 22,
    opacity: 0.25,
  },
});
