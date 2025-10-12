// src/hooks/useSafeNavigation.ts
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export const useSafeNavigation = () => {
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Check if navigation is available
    if (navigation) {
      setIsNavigationReady(true);
    }
  }, [navigation]);

  const safeNavigate = (screen: string, params?: any) => {
    if (isNavigationReady && navigation) {
      // @ts-ignore - Navigation type workaround
      navigation.navigate(screen, params);
    } else {
      console.warn('Navigation not ready yet');
    }
  };

  return {
    safeNavigate,
    isNavigationReady,
    navigation,
  };
};