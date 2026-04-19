import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { ClothingItem, ClothingType } from '../types';
import { CLOTHING_CONFIG } from '../constants/clothing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 50;

interface Props {
  type: ClothingType;
  items: ClothingItem[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

export default function OutfitSlot({ type, items, selectedIndex, onIndexChange }: Props) {
  const config = CLOTHING_CONFIG[type];
  const translateX = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const next = () => {
    const nextIndex = (selectedIndex + 1) % items.length;
    runOnJS(onIndexChange)(nextIndex);
    runOnJS(triggerHaptic)();
  };

  const prev = () => {
    const prevIndex = (selectedIndex - 1 + items.length) % items.length;
    runOnJS(onIndexChange)(prevIndex);
    runOnJS(triggerHaptic)();
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.4; // Slight drag feel
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD && items.length > 1) {
        runOnJS(next)();
      } else if (e.translationX > SWIPE_THRESHOLD && items.length > 1) {
        runOnJS(prev)();
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const currentItem = items[selectedIndex];

  return (
    <View style={styles.row}>
      {/* Type label */}
      <View style={styles.label}>
        <Text style={styles.labelIcon}>{config.icon}</Text>
        <Text style={styles.labelText}>{config.displayName}</Text>
      </View>

      {/* Image slot */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          {currentItem ? (
            <Image
              source={{ uri: currentItem.imageUri }}
              style={styles.image}
              contentFit="contain"
              transition={100}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>{config.icon}</Text>
              <Text style={styles.placeholderText}>No {config.pluralName.toLowerCase()}</Text>
            </View>
          )}
        </Animated.View>
      </GestureDetector>

      {/* Item counter */}
      <View style={styles.counter}>
        {items.length > 1 ? (
          <Text style={styles.counterText}>
            {selectedIndex + 1}/{items.length}
          </Text>
        ) : (
          <Text style={styles.counterText}>{items.length === 1 ? '1' : '—'}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    width: 72,
    alignItems: 'center',
    gap: 2,
  },
  labelIcon: {
    fontSize: 22,
  },
  labelText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  imageContainer: {
    flex: 1,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  placeholderIcon: {
    fontSize: 28,
    opacity: 0.3,
  },
  placeholderText: {
    fontSize: 11,
    color: '#AAA',
  },
  counter: {
    width: 36,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 12,
    color: '#AAA',
  },
});
