import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; 
import { useEffect, useState } from 'react';
import AccountDetailsScreen from '../../Screens/Account/AccountDetailsScreen';

export default function Account() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<null | boolean>(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const val: string | null = await SecureStore.getItem('@storage_Key');
      setIsUserLoggedIn(val !== null && val !== undefined);
    };
    checkUserLoggedIn();
  }, []);

  if (isUserLoggedIn === null) return null;

  return isUserLoggedIn ? (
    <AccountDetailsScreen />
  ) : (
    <Redirect href="/account/auth" />
  );
}
