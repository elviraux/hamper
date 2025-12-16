import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useCart, Order } from '@/context/CartContext';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <Ionicons name={icon} size={22} color={Colors.primary} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    )}
  </TouchableOpacity>
);

// Order status badge component
const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Delivered':
        return '#4CAF50';
      case 'Shipped':
        return '#2196F3';
      case 'Processing':
      default:
        return '#FF9800';
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
      <Text style={[styles.statusText, { color: getStatusColor() }]}>{status}</Text>
    </View>
  );
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format price
const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

// Order card component
const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>{order.id}</Text>
        <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
      </View>
      <StatusBadge status={order.status} />
    </View>
    <View style={styles.orderDivider} />
    <View style={styles.orderFooter}>
      <Text style={styles.orderItemCount}>
        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
      </Text>
      <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
    </View>
  </View>
);

// Empty orders component
const EmptyOrders: React.FC = () => (
  <View style={styles.emptyOrders}>
    <Ionicons name="receipt-outline" size={48} color={Colors.borderColor} />
    <Text style={styles.emptyOrdersTitle}>No past orders</Text>
    <Text style={styles.emptyOrdersSubtitle}>
      Your order history will appear here
    </Text>
  </View>
);

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { orderHistory } = useCart();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={Colors.textWhite} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileEmail}>Sign in to view your account</Text>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInButtonText}>SIGN IN / CREATE ACCOUNT</Text>
        </TouchableOpacity>

        {/* Order History Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Order History</Text>
          {orderHistory.length > 0 ? (
            <View style={styles.ordersContainer}>
              {orderHistory.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </View>
          ) : (
            <View style={styles.menuCard}>
              <EmptyOrders />
            </View>
          )}
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Subscriptions</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="calendar-outline"
              title="My Subscriptions"
              subtitle="Manage your monthly clubs"
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="gift-outline"
              title="Gift Subscriptions"
              subtitle="Send BBQ as a gift"
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="location-outline"
              title="Shipping Addresses"
              subtitle="Manage delivery addresses"
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage your payment options"
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage your preferences"
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              title="Help Center"
              subtitle="FAQs and support articles"
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="chatbubble-outline"
              title="Contact Us"
              subtitle="Get in touch with our team"
            />
          </View>
        </View>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: Spacing.base,
    flex: 1,
  },
  profileName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
  },
  profileEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.textBody,
    marginTop: Spacing.xs,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginTop: Spacing.base,
  },
  signInButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  menuSection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textHeading,
  },
  menuSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textBody,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginLeft: Spacing.base + 36 + Spacing.md,
  },
  // Order history styles
  ordersContainer: {
    gap: Spacing.md,
  },
  orderCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
  },
  orderDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  orderDivider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginVertical: Spacing.md,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.textBody,
  },
  orderTotal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
  },
  // Empty orders styles
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  emptyOrdersTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textHeading,
    marginTop: Spacing.md,
  },
  emptyOrdersSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  version: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
