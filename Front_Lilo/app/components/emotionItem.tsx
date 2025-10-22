import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface EmotionItemProps {
  imgSource: ImageSourcePropType;
  selected?: boolean;
  onPress: () => void;
  isRounded?: boolean;
  highlightColor?: string; // 👈 couleur personnalisée pour la sélection
  dimOthers?: boolean; // 👈 si on veut griser les autres
}

export default function EmotionItem({
  imgSource,
  selected = false,
  onPress,
  isRounded = false,
  highlightColor = '#ffde52',
  dimOthers = false,
}: EmotionItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={[
          styles.wrapper,
          isRounded && styles.rounded,
          { borderColor: selected ? highlightColor : 'transparent' },
        ]}
      >
        <Image
          source={imgSource}
          style={[
            styles.gridImage,
            isRounded && styles.roundedImage,
            dimOthers && !selected && styles.dimmedImage, // 👈 rend les autres gris
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const IMAGE_SIZE = 60;

const styles = StyleSheet.create({
  wrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: IMAGE_SIZE / 2,
  },
  gridImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'contain',
  },
  roundedImage: {
    borderRadius: IMAGE_SIZE / 2,
  },
  dimmedImage: {
    opacity: 0.4, // 👈 ou filter grayscale si web
  },
});
