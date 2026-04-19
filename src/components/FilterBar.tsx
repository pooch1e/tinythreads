import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BABY_SIZES } from '../constants/sizes';
import { BabySize, ClothingColour } from '../types';
import { COLOUR_PALETTE } from '../constants/colours';

interface Props {
  activeSize: BabySize | null;
  activeColour: ClothingColour | null;
  onSizeChange: (size: BabySize | null) => void;
  onColourChange: (colour: ClothingColour | null) => void;
  onClearAll: () => void;
}

type SheetType = 'size' | 'colour' | null;

export default function FilterBar({
  activeSize,
  activeColour,
  onSizeChange,
  onColourChange,
  onClearAll,
}: Props) {
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const hasFilters = Boolean(activeSize || activeColour);

  const sizeLabel = activeSize ?? 'All sizes';
  const colourLabel = activeColour?.name ?? 'All colours';

  const activeSizeInfo = useMemo(
    () => BABY_SIZES.find((entry) => entry.value === activeSize) ?? null,
    [activeSize],
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          <Pressable style={styles.trigger} onPress={() => setOpenSheet('size')}>
            <Text style={styles.triggerText}>{sizeLabel}</Text>
          </Pressable>

          <Pressable style={styles.trigger} onPress={() => setOpenSheet('colour')}>
            <Text style={styles.triggerText}>{colourLabel}</Text>
          </Pressable>

          {hasFilters ? (
            <Pressable style={styles.clearButton} onPress={onClearAll}>
              <Text style={styles.clearButtonText}>Clear all</Text>
            </Pressable>
          ) : null}
        </ScrollView>

        {hasFilters ? (
          <View style={styles.activeRow}>
            {activeSizeInfo ? (
              <Pressable style={styles.activeChip} onPress={() => onSizeChange(null)}>
                <Text style={styles.activeChipText}>{activeSizeInfo.label} ×</Text>
              </Pressable>
            ) : null}

            {activeColour ? (
              <Pressable style={styles.activeChip} onPress={() => onColourChange(null)}>
                <View style={[styles.activeChipDot, { backgroundColor: activeColour.hex }]} />
                <Text style={styles.activeChipText}>{activeColour.name} ×</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>

      <Modal
        visible={openSheet !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenSheet(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpenSheet(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {openSheet === 'size' ? (
              <>
                <Text style={styles.sheetTitle}>Filter by size</Text>
                <Pressable
                  style={styles.listRow}
                  onPress={() => {
                    onSizeChange(null);
                    setOpenSheet(null);
                  }}
                >
                  <Text style={styles.listLabel}>All sizes</Text>
                </Pressable>
                {BABY_SIZES.map((entry) => (
                  <Pressable
                    key={entry.value}
                    style={styles.listRow}
                    onPress={() => {
                      onSizeChange(entry.value);
                      setOpenSheet(null);
                    }}
                  >
                    <View>
                      <Text style={styles.listLabel}>{entry.label}</Text>
                      <Text style={styles.listSubLabel}>{entry.sublabel}</Text>
                    </View>
                  </Pressable>
                ))}
              </>
            ) : null}

            {openSheet === 'colour' ? (
              <>
                <Text style={styles.sheetTitle}>Filter by colour</Text>
                <Pressable
                  style={styles.listRow}
                  onPress={() => {
                    onColourChange(null);
                    setOpenSheet(null);
                  }}
                >
                  <Text style={styles.listLabel}>All colours</Text>
                </Pressable>
                {COLOUR_PALETTE.map((entry) => (
                  <Pressable
                    key={entry.name}
                    style={styles.listRow}
                    onPress={() => {
                      onColourChange(entry);
                      setOpenSheet(null);
                    }}
                  >
                    <View style={styles.colourRow}>
                      <View
                        style={[
                          styles.colourDot,
                          {
                            backgroundColor: entry.hex,
                            borderColor: entry.hex === '#FFFFFF' ? '#DDD' : entry.hex,
                          },
                        ]}
                      />
                      <Text style={styles.listLabel}>{entry.name}</Text>
                    </View>
                  </Pressable>
                ))}
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  row: {
    gap: 8,
    paddingRight: 12,
  },
  trigger: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#F4F4F4',
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#FFF0F0',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C62828',
  },
  activeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF55',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  listRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECECEC',
  },
  listLabel: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  listSubLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  colourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colourDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
