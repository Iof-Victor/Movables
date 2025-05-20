import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; 
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AccountDetailsScreen from '../../Screens/Account/AccountDetailsScreen';

export default function Account() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserLoggedIn = async () => {
    try {
      const val: string | null = await SecureStore.getItemAsync('storage_Key');
      console.log('val', val !== null, '---', val !== undefined);
      setIsUserLoggedIn(val !== null && val !== undefined);
    } catch (error) {
      console.log('Error checking login status:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isUserLoggedIn) {
    return <Redirect href="/account/auth" />;
  }

  return (
    <View style={styles.container}>
      <AccountDetailsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});