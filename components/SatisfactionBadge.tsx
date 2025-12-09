import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '@/constants/theme';

interface SatisfactionBadgeProps {
  size?: number;
}

export const SatisfactionBadge: React.FC<SatisfactionBadgeProps> = ({
  size = 70,
}) => {
  const scale = size / 70;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer serrated circle */}
      <View style={[styles.outerCircle, { width: size, height: size }]}>
        {/* Inner circle */}
        <View
          style={[
            styles.innerCircle,
            { width: size * 0.85, height: size * 0.85 },
          ]}
        >
          {/* Content */}
          <Text style={[styles.guaranteeText, { fontSize: 6 * scale }]}>
            SATISFACTION
          </Text>
          <Text style={[styles.percentText, { fontSize: 16 * scale }]}>
            100%
          </Text>
          <Text style={[styles.guaranteedText, { fontSize: 7 * scale }]}>
            GUARANTEED
          </Text>
        </View>
      </View>
      {/* Decorative notches - simulated with border */}
      <View style={[styles.notchContainer, { width: size, height: size }]}>
        {Array.from({ length: 24 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.notch,
              {
                transform: [
                  { rotate: `${index * 15}deg` },
                  { translateY: -size / 2 + 3 },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    borderRadius: 100,
    backgroundColor: '#1A237E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1A237E',
  },
  innerCircle: {
    borderRadius: 100,
    backgroundColor: '#1A237E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C5CAE9',
  },
  guaranteeText: {
    color: '#C5CAE9',
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  percentText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.extrabold,
    marginVertical: -2,
  },
  guaranteedText: {
    color: '#C5CAE9',
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  notchContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notch: {
    position: 'absolute',
    width: 4,
    height: 6,
    backgroundColor: '#1A237E',
  },
});

export default SatisfactionBadge;
