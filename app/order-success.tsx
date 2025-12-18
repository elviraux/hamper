import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Confetti piece colors matching the BBQ theme
const CONFETTI_COLORS = [
  Colors.primary, // Red
  '#FFC107', // Gold
  '#4CAF50', // Green
  Colors.logoNavy, // Navy
  '#FF9800', // Orange
  '#9C27B0', // Purple
];

// Individual confetti piece component
const ConfettiPiece: React.FC<{
  delay: number;
  startX: number;
  color: string;
  size: number;
  rotation: number;
}> = ({ delay, startX, color, size, rotation }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(startX)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateConfetti = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT + 100,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: startX + (Math.random() - 0.5) * 200,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: rotation,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    animateConfetti();
  }, [delay, startX, rotation, translateY, translateX, rotate, opacity]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${rotation * 360}deg`],
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          width: size,
          height: size * 2,
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { rotate: rotateInterpolate },
          ],
          opacity,
        },
      ]}
    />
  );
};

// Generate confetti pieces
const generateConfetti = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 1000,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 8,
    rotation: 2 + Math.random() * 4,
  }));
};

export default function OrderSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  // Animation values for the main content
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Generate confetti pieces
  const confettiPieces = useRef(generateConfetti(50)).current;

  useEffect(() => {
    // Animate the main content
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handleContinueShopping = () => {
    router.replace('/(tabs)');
  };

  const handleViewOrders = () => {
    router.replace('/(tabs)/account');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Confetti */}
      <View style={styles.confettiContainer}>
        {confettiPieces.map((piece) => (
          <ConfettiPiece
            key={piece.id}
            delay={piece.delay}
            startX={piece.startX}
            color={piece.color}
            size={piece.size}
            rotation={piece.rotation}
          />
        ))}
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={60} color={Colors.textWhite} />
          </View>
        </View>

        {/* Thank You Message */}
        <Text style={styles.thankYouText}>Thank You!</Text>
        <Text style={styles.subtitle}>Your order has been placed successfully</Text>

        {/* Order ID */}
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>{orderId || 'N/A'}</Text>
        </View>

        {/* Confirmation Message */}
        <View style={styles.messageContainer}>
          <Ionicons name="mail-outline" size={20} color={Colors.primary} />
          <Text style={styles.messageText}>
            A confirmation email has been sent to your email address
          </Text>
        </View>

        {/* BBQ Pig Icon */}
        <View style={styles.pigContainer}>
          <Text style={styles.pigEmoji}>🐷</Text>
          <Text style={styles.pigMessage}>Your BBQ is on its way!</Text>
        </View>
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewOrdersButton}
          onPress={handleViewOrders}
          activeOpacity={0.8}
        >
          <Text style={styles.viewOrdersButtonText}>VIEW MY ORDERS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  thankYouText: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    color: Colors.textBody,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  orderIdContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  orderIdLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  orderId: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}10`,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  messageText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.textBody,
    textAlign: 'center',
  },
  pigContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  pigEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  pigMessage: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  buttonsContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  viewOrdersButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  viewOrdersButtonText: {
    color: Colors.primary,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
});
