import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { StarRating } from '@/components/StarRating';
import { SatisfactionBadge } from '@/components/SatisfactionBadge';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { getProductById } from '@/data/products';
import { useCart, planOptions } from '@/context/CartContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const { addToCart } = useCart();

  const product = getProductById(id || '');

  if (!product) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Simulate multiple images (using same image with variations)
  const productImages = [
    product.image,
    product.image.replace('w=400', 'w=401'), // Slightly different URL for demo
    product.image.replace('w=400', 'w=402'),
  ];

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const handleShare = async () => {
    Alert.alert('Share', `Share ${product.title} with friends!`);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedPlan || undefined);

    const planLabel = selectedPlan
      ? planOptions.find(p => p.value === selectedPlan)?.label
      : null;

    Alert.alert(
      'Added to Cart',
      `${product.title}${planLabel ? ` (${planLabel})` : ''} has been added to your cart!`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
      ]
    );
  };

  const handleSelectPlan = (planValue: string) => {
    setSelectedPlan(planValue);
    setShowPlanPicker(false);
  };

  const selectedPlanLabel = selectedPlan
    ? planOptions.find((p) => p.value === selectedPlan)?.label
    : 'Select Plan';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textHeading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title}
        </Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShare}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="share-outline" size={24} color={Colors.textHeading} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <ProductImageCarousel images={productImages} />

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Title */}
          <Text style={styles.productTitle}>{product.title}</Text>

          {/* Rating */}
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size={18}
          />

          {/* Price */}
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

          {/* Plan Selector */}
          <TouchableOpacity
            style={styles.planSelector}
            onPress={() => setShowPlanPicker(!showPlanPicker)}
          >
            <Text
              style={[
                styles.planSelectorText,
                !selectedPlan && styles.planSelectorPlaceholder,
              ]}
            >
              {selectedPlanLabel}
            </Text>
            <Ionicons
              name={showPlanPicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.textBody}
            />
          </TouchableOpacity>

          {/* Plan Options Dropdown */}
          {showPlanPicker && (
            <View style={styles.planDropdown}>
              {planOptions.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planOption,
                    selectedPlan === plan.value && styles.planOptionSelected,
                  ]}
                  onPress={() => handleSelectPlan(plan.value)}
                >
                  <Text
                    style={[
                      styles.planOptionText,
                      selectedPlan === plan.value && styles.planOptionTextSelected,
                    ]}
                  >
                    {plan.label}
                  </Text>
                  {selectedPlan === plan.value && (
                    <Ionicons name="checkmark" size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <View style={styles.descriptionContent}>
              <Text style={styles.descriptionHeading}>
                Small-Batch Bacon, Delivered Monthly
              </Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <SatisfactionBadge size={75} />
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="cube-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Free Shipping</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Easy Returns</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="gift-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Gift Options</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Add to Cart Button */}
      <View style={[styles.stickyFooter, { paddingBottom: insets.bottom + Spacing.base }]}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>ADD TO CART</Text>
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
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: Typography.sizes.lg,
    color: Colors.textHeading,
    marginBottom: Spacing.base,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    color: Colors.textWhite,
    fontWeight: Typography.weights.semibold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  headerButton: {
    padding: Spacing.xs,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textHeading,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for sticky footer
  },
  productInfo: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  productTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
    marginBottom: Spacing.sm,
  },
  productPrice: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  planSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  planSelectorText: {
    fontSize: Typography.sizes.base,
    color: Colors.textHeading,
  },
  planSelectorPlaceholder: {
    color: Colors.textBody,
  },
  planDropdown: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  planOptionSelected: {
    backgroundColor: `${Colors.primary}10`,
  },
  planOptionText: {
    fontSize: Typography.sizes.base,
    color: Colors.textHeading,
  },
  planOptionTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  descriptionSection: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  descriptionContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  descriptionHeading: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    fontSize: Typography.sizes.md,
    color: Colors.textBody,
    lineHeight: Typography.sizes.md * 1.5,
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Spacing.xs,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  infoItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textBody,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
});
