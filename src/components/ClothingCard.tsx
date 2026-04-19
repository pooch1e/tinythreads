import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ClothingItem } from '../types';
import { CLOTHING_CONFIG } from '../constants/clothing';

interface Props {
  item: ClothingItem;
  onLongPress?: () => void;
  size?: number;
}

export default function ClothingCard({ item, onLongPress, size = 90 }: Props) {
  const config = CLOTHING_CONFIG[item.type];
  const hasMeta = Boolean(item.size || item.colour);

  return (
    <Pressable
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, { width: size, height: size }, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.image}
        contentFit="contain"
        transition={150}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{config.icon}</Text>
      </View>

      {hasMeta ? (
        <View style={styles.metaBadge}>
          {item.colour ? (
            <View
              style={[
                styles.colourDot,
                {
                  backgroundColor: item.colour.hex,
                  borderColor: item.colour.hex === '#FFFFFF' ? '#DDD' : item.colour.hex,
                },
              ]}
            />
          ) : null}
          {item.size ? <Text style={styles.metaText}>{item.size}</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    margin: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 8,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 11,
  },
  metaBadge: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  colourDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 10,
    color: '#1A1A1A',
    fontWeight: '600',
  },
});
