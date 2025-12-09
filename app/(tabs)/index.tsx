import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { getFeaturedProducts, Product, HeroBanner } from '@/data/products';

export default function HomeScreen() {
  const cartItemCount = 2;
  const featuredProducts = getFeaturedProducts();

  const handleMenuPress = () => {
    // Menu functionality - could open drawer
    console.log('Menu pressed');
  };

  const handleSearchPress = () => {
    // Search functionality
    console.log('Search pressed');
  };

  const handleCartPress = () => {
    router.push('/(tabs)/cart');
  };

  const handleBannerPress = (_banner: HeroBanner) => {
    router.push('/(tabs)/shop');
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  // Split products into pairs for the grid
  const renderProductGrid = () => {
    const rows = [];
    for (let i = 0; i < featuredProducts.length; i += 2) {
      const leftProduct = featuredProducts[i];
      const rightProduct = featuredProducts[i + 1];
      rows.push(
        <View key={i} style={styles.productRow}>
          <ProductCard product={leftProduct} onPress={handleProductPress} />
          {rightProduct && (
            <ProductCard product={rightProduct} onPress={handleProductPress} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <Header
        cartItemCount={cartItemCount}
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        onCartPress={handleCartPress}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Carousel */}
        <HeroCarousel onBannerPress={handleBannerPress} />

        {/* Featured Products Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <View style={styles.productGrid}>
            {renderProductGrid()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  sectionContainer: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
    marginBottom: Spacing.base,
  },
  productGrid: {
    flexDirection: 'column',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
