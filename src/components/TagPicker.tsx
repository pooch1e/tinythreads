import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { BabySize, ClothingColour } from '../types';
import { BABY_SIZES } from '../constants/sizes';
import { COLOUR_PALETTE } from '../constants/colours';

interface Props {
  size: BabySize | null;
  colour: ClothingColour | null;
  onSizeChange: (size: BabySize | null) => void;
  onColourChange: (colour: ClothingColour | null) => void;
}

export default function TagPicker({
  size,
  colour,
  onSizeChange,
  onColourChange,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Size (optional)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sizeRow}>
          {BABY_SIZES.map((entry) => {
            const selected = size === entry.value;
            return (
              <Pressable
                key={entry.value}
                style={({ pressed }) => [
                  styles.sizePill,
                  selected && styles.sizePillSelected,
                  pressed && styles.pressed,
                ]}
                onPress={() => onSizeChange(selected ? null : entry.value)}
              >
                <Text style={[styles.sizeLabel, selected && styles.sizeLabelSelected]}>{entry.label}</Text>
                <Text style={[styles.sizeSubLabel, selected && styles.sizeSubLabelSelected]}>
                  {entry.sublabel}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Colour (optional)</Text>
        <View style={styles.colourGrid}>
          {COLOUR_PALETTE.map((entry) => {
            const selected = colour?.hex === entry.hex;
            const borderColor = entry.hex === '#FFFFFF' ? '#DDD' : entry.hex;

            return (
              <Pressable
                key={entry.name}
                style={({ pressed }) => [styles.colourItem, pressed && styles.pressed]}
                onPress={() => onColourChange(selected ? null : entry)}
              >
                <View
                  style={[
                    styles.colourSwatchOuter,
                    selected && { borderColor },
                  ]}
                >
                  <View style={[styles.colourSwatchInner, { backgroundColor: entry.hex }]} />
                </View>
                <Text style={[styles.colourLabel, selected && styles.colourLabelSelected]}>
                  {entry.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  section: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sizeRow: {
    gap: 10,
    paddingRight: 12,
  },
  sizePill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#ECECEC',
    minWidth: 82,
  },
  sizePillSelected: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  sizeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sizeLabelSelected: {
    color: '#FFFFFF',
  },
  sizeSubLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  sizeSubLabelSelected: {
    color: '#E0E0E0',
  },
  colourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colourItem: {
    width: '20%',
    minWidth: 56,
    alignItems: 'center',
    gap: 6,
  },
  colourSwatchOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colourSwatchInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  colourLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  colourLabelSelected: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
