import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ThemeAwareLogoProps {
  size?: number;
}

export const ThemeAwareLogo: React.FC<ThemeAwareLogoProps> = ({ size = 100 }) => {
  const { isDark } = useTheme();

  const logoSource = isDark
    ? require('../../../assets/icons/connectme-dark.png')
    : require('../../../assets/icons/connectme-light.png');

  return (
    <View style={[styles.container, { width: 180, height: 150 }]}>
      <Image
        source={logoSource}
        style={[styles.logo, { width: 180, height: 230 }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  logo: {
    borderRadius: 10,
    width: 300,
    height: 250,
  },
});