// EmotionItem.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface EmotionItemProps {
  imgSource: ImageSourcePropType; // ✅ type correct
  selected: boolean;
  onPress: () => void;
}

export default function EmotionItem({ imgSource, selected, onPress }: EmotionItemProps) {
  return (
    <TouchableOpacity
      style={[styles.gridItem, selected && styles.selectedItem]}
      onPress={onPress}
      activeOpacity={1} // ✅ plus de transparence au clic
    >
      <Image source={imgSource} style={styles.gridImage} />
    </TouchableOpacity>
  );
}

const IMAGE_SIZE = 60;

const styles = StyleSheet.create({
  gridItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: '#FF7DAF',
  },
  gridImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'contain',
  },
});
