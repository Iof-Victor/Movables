import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { useRouter,usePathname } from 'expo-router';


const Header = ({ title }: { title?: string }) => {
  const navigation = useNavigation();
  const [goBackTrigger, setGoBackTrigger] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    const noBackTitles = ['Home', 'Cart', 'Log In', 'My Account', 'Edit Details'];
    setGoBackTrigger(!noBackTitles.includes(title ?? ''));
  }, [title]);

  useEffect(() => {
    const noBackPaths = ['/home', '/cart', '/account/auth', '/account'];
    const isNoBackPath = noBackPaths.includes(pathname);
    const isCheckoutPage = pathname === '/cart/checkout';

    setGoBackTrigger(!isNoBackPath || isCheckoutPage);
  }, [pathname]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back(); 
    } else {
      navigation.goBack(); 
    }
  };

  return (
    <SafeAreaView style={styles.backgroundColor}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {goBackTrigger && (
            <TouchableOpacity
              onPress={handleGoBack}
              testID="headerBackButton"
              style={styles.icon}
            >
             <Ionicons name="chevron-back" size={24}  />
            </TouchableOpacity>
          )}
          <View style={styles.titleDisplay}>
            <Text style={styles.titleScreen}>{title}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  icon: {
    marginHorizontal: 3,
    position: 'absolute',
    left: 2,
  },
  titleScreen: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
  },
  titleDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundColor: {
    backgroundColor: '#f1faee',
  },
});

export default Header;
