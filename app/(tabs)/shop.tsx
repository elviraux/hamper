import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { products, Product } from '@/data/products';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';

const categories = ['All', 'Subscriptions', 'BBQ', 'Holiday', 'Treats', 'Seasonings'];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const { totalItems } = useCart();

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleCartPress = () => {
    router.push('/(tabs)/cart');
  };

  const renderProductGrid = () => {
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const leftProduct = filteredProducts[i];
      const rightProduct = filteredProducts[i + 1];
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
        cartItemCount={totalItems}
        onCartPress={handleCartPress}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products */}
        <View style={styles.productContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </Text>
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
  categoryContainer: {
    marginTop: Spacing.md,
  },
  categoryContent: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginRight: Spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textBody,
  },
  categoryTextActive: {
    color: Colors.textWhite,
  },
  productContainer: {
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
