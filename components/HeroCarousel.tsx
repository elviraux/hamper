import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { HeroBanner, heroBanners } from '@/data/products';

const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_WIDTH = screenWidth - Spacing.base * 2;
const CAROUSEL_HEIGHT = 180;
const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

interface HeroCarouselProps {
  onBannerPress?: (banner: HeroBanner) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onBannerPress }) => {
  const flatListRef = useRef<FlatList<HeroBanner>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    autoScrollTimer.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % heroBanners.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const handleScrollBeginDrag = useCallback(() => {
    stopAutoScroll();
  }, [stopAutoScroll]);

  const handleScrollEndDrag = useCallback(() => {
    startAutoScroll();
  }, [startAutoScroll]);

  const renderBanner = ({ item }: { item: HeroBanner }) => (
    <TouchableOpacity
      style={styles.bannerContainer}
      activeOpacity={0.95}
      onPress={() => onBannerPress?.(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.bannerImage}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        )}
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => onBannerPress?.(item)}
        >
          <Text style={styles.shopButtonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        index === activeIndex ? styles.dotActive : styles.dotInactive,
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={heroBanners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        getItemLayout={(_, index) => ({
          length: CAROUSEL_WIDTH,
          offset: CAROUSEL_WIDTH * index,
          index,
        })}
        snapToInterval={CAROUSEL_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.pagination}>
        {heroBanners.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
  },
  flatListContent: {
    // No extra padding needed
  },
  bannerContainer: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    maxWidth: '60%',
  },
  bannerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textWhite,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textWhite,
    marginTop: Spacing.xs,
    opacity: 0.9,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
  },
  shopButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.textHeading,
  },
  dotInactive: {
    backgroundColor: Colors.borderColor,
  },
});

export default HeroCarousel;
