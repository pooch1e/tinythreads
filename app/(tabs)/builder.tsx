import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useWardrobe } from '../../src/hooks/useWardrobe';
import { useLooks } from '../../src/hooks/useLooks';
import OutfitSlot from '../../src/components/OutfitSlot';
import EmptyState from '../../src/components/EmptyState';
import { CLOTHING_TYPES } from '../../src/constants/clothing';
import { ClothingType, MAX_LOOKS } from '../../src/types';
import { useRouter, useFocusEffect } from 'expo-router';

export default function BuilderScreen() {
  const router = useRouter();
  const { items, refresh } = useWardrobe();
  const { addLook, atLimit, looks } = useLooks();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const [selectedIndices, setSelectedIndices] = useState<Record<ClothingType, number>>({
    hat: 0,
    top: 0,
    trousers: 0,
    socks: 0,
  });

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [lookName, setLookName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const itemsByType = useMemo(() => {
    const map: Partial<Record<ClothingType, typeof items>> = {};
    for (const type of CLOTHING_TYPES) {
      map[type] = items.filter((i) => i.type === type);
    }
    return map;
  }, [items]);

  const hasAnyItems = items.length > 0;

  const handleIndexChange = (type: ClothingType, index: number) => {
    setSelectedIndices((prev) => ({ ...prev, [type]: index }));
  };

  const handleSaveLook = async () => {
    setIsSaving(true);
    const itemIds: Partial<Record<ClothingType, string>> = {};
    for (const type of CLOTHING_TYPES) {
      const typeItems = itemsByType[type] ?? [];
      if (typeItems.length > 0) {
        const idx = Math.min(selectedIndices[type], typeItems.length - 1);
        itemIds[type] = typeItems[idx].id;
      }
    }

    await addLook(lookName, itemIds);
    setIsSaving(false);
    setNameModalVisible(false);
    setLookName('');
    router.push('/(tabs)/looks');
  };

  if (!hasAnyItems) {
    return (
      <EmptyState
        icon="✨"
        title="Nothing to build with"
        subtitle="Add some clothing items to your wardrobe first."
        actionLabel="Add Item"
        onAction={() => router.push('/(tabs)/add')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.slots}>
        {CLOTHING_TYPES.map((type) => {
          const typeItems = itemsByType[type] ?? [];
          const idx = Math.min(selectedIndices[type], Math.max(typeItems.length - 1, 0));
          return (
            <OutfitSlot
              key={type}
              type={type}
              items={typeItems}
              selectedIndex={idx}
              onIndexChange={(i) => handleIndexChange(type, i)}
            />
          );
        })}
      </ScrollView>

      {/* Save button */}
      <View style={styles.footer}>
        {atLimit && (
          <Text style={styles.limitText}>Looks ({looks.length}/{MAX_LOOKS})</Text>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            atLimit && styles.saveButtonDisabled,
            pressed && !atLimit && styles.saveButtonPressed,
          ]}
          onPress={() => !atLimit && setNameModalVisible(true)}
          disabled={atLimit}
        >
          <Text style={styles.saveButtonText}>
            {atLimit ? `Limit reached (${MAX_LOOKS}/${MAX_LOOKS})` : 'Save Look'}
          </Text>
        </Pressable>
      </View>

      {/* Name modal */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Name this look</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Sunday Stroll"
              value={lookName}
              onChangeText={setLookName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveLook}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setNameModalVisible(false);
                  setLookName('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSave, isSaving && styles.modalSaveDisabled]}
                onPress={handleSaveLook}
                disabled={isSaving}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  slots: {
    paddingVertical: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
    gap: 6,
  },
  limitText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AAA',
  },
  saveButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontWeight: '600',
    color: '#666',
  },
  modalSave: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  modalSaveDisabled: {
    backgroundColor: '#CCC',
  },
  modalSaveText: {
    fontWeight: '600',
    color: '#FFF',
  },
});
