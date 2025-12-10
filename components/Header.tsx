import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '@/constants/theme';

interface HeaderProps {
  cartItemCount?: number;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount = 0,
  onMenuPress,
  onSearchPress,
  onCartPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Left: Hamburger Menu */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMenuPress}
          accessibilityLabel="Menu"
        >
          <Ionicons name="menu" size={26} color={Colors.textHeading} />
        </TouchableOpacity>

        {/* Center: Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoPig}>PIG</Text>
          <Text style={styles.logoOf}>of the Month</Text>
          <View style={styles.logoBBQContainer}>
            <View style={styles.logoDash} />
            <Text style={styles.logoBBQ}>BBQ</Text>
            <View style={styles.logoDash} />
          </View>
        </View>

        {/* Right: Search & Cart */}
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            accessibilityLabel="Search"
          >
            <Ionicons name="search" size={24} color={Colors.textHeading} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onCartPress}
            accessibilityLabel="Cart"
          >
            <Ionicons name="cart-outline" size={24} color={Colors.textHeading} />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    ...Shadows.header,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  iconButton: {
    padding: Spacing.xs,
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logoPig: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.logoRed,
    letterSpacing: 2,
  },
  logoOf: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
    color: Colors.logoNavy,
    marginTop: -4,
  },
  logoBBQContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
  },
  logoDash: {
    width: 20,
    height: 1.5,
    backgroundColor: Colors.logoNavy,
    marginHorizontal: 6,
  },
  logoBBQ: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.logoNavy,
    letterSpacing: 3,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.badgeBackground,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});

export default Header;
