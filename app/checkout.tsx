import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useCart } from '@/context/CartContext';

// Shipping threshold for free shipping
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 10;

interface FormData {
  // Shipping
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  // Payment (visual only)
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { items, cartTotal, placeOrder } = useCart();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cartTotal + shipping;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add space every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after first 2 digits
    if (digits.length >= 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Shipping validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Invalid ZIP code';
    }

    // Payment validation (basic visual validation)
    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardDigits.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate a brief delay for order processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      const order = placeOrder({
        name: formData.name.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
      });

      // Navigate to success screen with order ID
      router.replace({
        pathname: '/order-success',
        params: { orderId: order.id },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderInput = (
    label: string,
    field: keyof FormData,
    options?: {
      placeholder?: string;
      keyboardType?: TextInput['props']['keyboardType'];
      autoCapitalize?: TextInput['props']['autoCapitalize'];
      maxLength?: number;
      formatter?: (value: string) => string;
      secureTextEntry?: boolean;
    }
  ) => {
    const value = formData[field];
    const error = errors[field];

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={(text) => {
            const formattedText = options?.formatter ? options.formatter(text) : text;
            updateField(field, formattedText);
          }}
          placeholder={options?.placeholder}
          placeholderTextColor={Colors.textLight}
          keyboardType={options?.keyboardType}
          autoCapitalize={options?.autoCapitalize}
          maxLength={options?.maxLength}
          secureTextEntry={options?.secureTextEntry}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textHeading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Shipping Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={22} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Shipping Address</Text>
            </View>
            <View style={styles.sectionCard}>
              {renderInput('Full Name', 'name', {
                placeholder: 'John Doe',
                autoCapitalize: 'words',
              })}
              {renderInput('Street Address', 'street', {
                placeholder: '123 BBQ Lane',
                autoCapitalize: 'words',
              })}
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  {renderInput('City', 'city', {
                    placeholder: 'Austin',
                    autoCapitalize: 'words',
                  })}
                </View>
                <View style={styles.rowItemSmall}>
                  {renderInput('State', 'state', {
                    placeholder: 'TX',
                    autoCapitalize: 'characters',
                    maxLength: 2,
                  })}
                </View>
              </View>
              {renderInput('ZIP Code', 'zipCode', {
                placeholder: '78701',
                keyboardType: 'number-pad',
                maxLength: 10,
              })}
            </View>
          </View>

          {/* Payment Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card-outline" size={22} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Payment Details</Text>
            </View>
            <View style={styles.sectionCard}>
              {renderInput('Card Number', 'cardNumber', {
                placeholder: '1234 5678 9012 3456',
                keyboardType: 'number-pad',
                maxLength: 19,
                formatter: formatCardNumber,
              })}
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  {renderInput('Expiry Date', 'expiryDate', {
                    placeholder: 'MM/YY',
                    keyboardType: 'number-pad',
                    maxLength: 5,
                    formatter: formatExpiryDate,
                  })}
                </View>
                <View style={styles.rowItemSmall}>
                  {renderInput('CVV', 'cvv', {
                    placeholder: '123',
                    keyboardType: 'number-pad',
                    maxLength: 4,
                    secureTextEntry: true,
                  })}
                </View>
              </View>
              <View style={styles.secureNotice}>
                <Ionicons name="lock-closed" size={14} color={Colors.textLight} />
                <Text style={styles.secureNoticeText}>
                  Your payment information is secure
                </Text>
              </View>
            </View>
          </View>

          {/* Order Summary Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt-outline" size={22} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                </Text>
                <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.base }]}>
          <TouchableOpacity
            style={[styles.placeOrderButton, isSubmitting && styles.placeOrderButtonDisabled]}
            onPress={handlePlaceOrder}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <Text style={styles.placeOrderButtonText}>
              {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
  },
  headerPlaceholder: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
  },
  sectionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textBody,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textHeading,
  },
  inputError: {
    borderColor: Colors.primary,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  rowItemSmall: {
    flex: 0.5,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  secureNoticeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
  },
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.textBody,
  },
  summaryValue: {
    fontSize: Typography.sizes.md,
    color: Colors.textHeading,
  },
  freeShipping: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
  },
  totalValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textHeading,
  },
  footer: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  placeOrderButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
});
