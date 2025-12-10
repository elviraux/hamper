import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface StarRatingProps {
  rating: number;
  reviewCount: number;
  size?: number;
  showText?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 16,
  showText = true,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Ionicons
            key={`full-${index}`}
            name="star"
            size={size}
            color="#FFB800"
          />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <Ionicons name="star-half" size={size} color="#FFB800" />
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Ionicons
            key={`empty-${index}`}
            name="star-outline"
            size={size}
            color="#FFB800"
          />
        ))}
      </View>
      {showText && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)}/5 ({reviewCount} reviews)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sizes.sm,
    color: Colors.textBody,
  },
});

export default StarRating;
