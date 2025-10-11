import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onAnimationComplete 
}) => {
  const { colors, getGradientColors, isDark } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      
      // Scale up
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      
      // Slide up
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for loading text
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Complete animation and callback
    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // FIX: Use direct color assignment based on theme
  const gradientColors = isDark 
    ? ['#1e3a8a', '#0f172a'] as const
    : ['#2563EB', '#3B82F6'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideUpAnim },
            ],
          },
        ]}
      >
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoShadow,
              {
                shadowOpacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>💬</Text>
            </View>
          </Animated.View>
        </View>

        {/* App Name & Tagline */}
        <View style={styles.textContainer}>
          <Text style={styles.appName}>ConnectMe</Text>
          <Animated.View style={{ opacity: pulseAnim }}>
            <Text style={styles.tagline}>Stay connected, instantly</Text>
          </Animated.View>
        </View>

        {/* Animated Loading */}
        <View style={styles.loadingContainer}>
          <Animated.View 
            style={[
              styles.loadingBar,
              {
                opacity: pulseAnim,
                transform: [{ scaleX: pulseAnim }],
              }
            ]} 
          />
          <Animated.Text 
            style={[
              styles.loadingText,
              { opacity: pulseAnim }
            ]}
          >
            Initializing your chat experience...
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure • Fast • Reliable</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowRadius: 25,
    elevation: 15,
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 60,
    color: 'white',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    width: 200,
  },
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
});

export { SplashScreen };