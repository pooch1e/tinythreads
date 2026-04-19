import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useWardrobe } from '../../src/hooks/useWardrobe';
import { useModelStatus } from '../../src/hooks/useModelStatus';
import { CLOTHING_TYPES, CLOTHING_CONFIG } from '../../src/constants/clothing';
import TagPicker from '../../src/components/TagPicker';
import { BabySize, ClothingColour, ClothingType } from '../../src/types';

export default function AddScreen() {
  const router = useRouter();
  const { addItem, isAdding } = useWardrobe();
  const modelStatus = useModelStatus();
  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedSize, setSelectedSize] = useState<BabySize | null>(null);
  const [selectedColour, setSelectedColour] = useState<ClothingColour | null>(null);

  const handlePickImage = async () => {
    if (!selectedType) {
      Alert.alert('Select a type', 'Please choose a clothing type first.');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'TinyThreads needs access to your photos to add clothing items.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) return;

    const item = await addItem(
      selectedType,
      result.assets[0].uri,
      selectedSize,
      selectedColour,
    );
    if (item) {
      setSelectedType(null);
      setSelectedSize(null);
      setSelectedColour(null);
      router.push('/(tabs)/wardrobe');
    }
  };

  const isModelLoading = modelStatus.status === 'downloading' || modelStatus.status === 'loading';
  const backgroundRemovalAvailable = modelStatus.status === 'ready';
  const backgroundRemovalUnavailable = modelStatus.status === 'error';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Model status notice */}
      {isModelLoading && (
        <View style={styles.modelNotice}>
          <ActivityIndicator size="small" color="#888" />
          <Text style={styles.modelNoticeText}>
            Preparing background removal...
          </Text>
        </View>
      )}

      {backgroundRemovalUnavailable ? (
        <View style={styles.modelNotice}>
          <Text style={styles.modelNoticeText}>
            Background removal is unavailable in Expo Go. Photos will be saved as-is.
          </Text>
        </View>
      ) : null}

      {/* Type selector */}
      <Text style={styles.sectionLabel}>What are you adding?</Text>
      <View style={styles.typeGrid}>
        {CLOTHING_TYPES.map((type) => {
          const config = CLOTHING_CONFIG[type];
          const selected = selectedType === type;
          return (
            <Pressable
              key={type}
              style={({ pressed }) => [
                styles.typeButton,
                selected && styles.typeButtonSelected,
                pressed && styles.typeButtonPressed,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={styles.typeIcon}>{config.icon}</Text>
              <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>
                {config.displayName}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <TagPicker
        size={selectedSize}
        colour={selectedColour}
        onSizeChange={setSelectedSize}
        onColourChange={setSelectedColour}
      />

      {/* Upload button */}
      <Pressable
        style={({ pressed }) => [
          styles.uploadButton,
          (!selectedType || isAdding) && styles.uploadButtonDisabled,
          pressed && styles.uploadButtonPressed,
        ]}
        onPress={handlePickImage}
        disabled={!selectedType || isAdding}
      >
        {isAdding ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.uploadButtonText}>
            {selectedType
              ? `Choose Photo for ${CLOTHING_CONFIG[selectedType].displayName}`
              : 'Select a type above'}
          </Text>
        )}
      </Pressable>

      {isAdding && (
        <Text style={styles.processingHint}>
          {backgroundRemovalAvailable ? 'Removing background...' : 'Saving image...'}
        </Text>
      )}

      <Text style={styles.hint}>Long-press any item in the wardrobe to remove it.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  modelNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
  },
  modelNoticeText: {
    fontSize: 13,
    color: '#666',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonSelected: {
    backgroundColor: '#1A1A1A10',
    borderColor: '#1A1A1A',
  },
  typeButtonPressed: {
    opacity: 0.7,
  },
  typeIcon: {
    fontSize: 26,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
  },
  typeLabelSelected: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  uploadButtonDisabled: {
    backgroundColor: '#CCC',
  },
  uploadButtonPressed: {
    opacity: 0.8,
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
  processingHint: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
  },
  hint: {
    textAlign: 'center',
    color: '#BBB',
    fontSize: 12,
    marginTop: 8,
  },
});
