import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useFocusEffect,router } from 'expo-router';

const AccountDetailsScreen = () => {
  const router = useRouter();
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');

  const getData = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('storage_Key');
      const data = JSON.parse(jsonValue || '{}');
      if (data?.id) {
        setFirstName(data.firstName || '');
        setId(data.id);
      }
    } catch (e) {
      console.log('Error loading user data', e);
    }
  };

  const clearStorage = async () => {
    try {
      await SecureStore.deleteItemAsync('storage_Key');
      router.replace('/account/auth');
    } catch (e) {
      alert('Failed to log out');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Image
          source={require('../../assets/imagines/logo.png')}
          style={styles.logo}
        /> */}
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome back, {firstName}!</Text>
      </View>

      <View style={{ marginTop: 300, alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/account/edit')}
        >
          <Text style={styles.buttonText}>Edit Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={() => router.push('/account/orders')}
        >
          <Text style={styles.buttonText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 20, backgroundColor: '#C45B5B' }]}
          onPress={clearStorage}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    right: 130,
    backgroundColor: 'white',
  },
  logo: {
    resizeMode: 'cover',
    height: 160,
    width: 150,
  },
  button: {
    backgroundColor: '#9EB7B8',
    width: 300,
    borderRadius: 15,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 150,
  },
  headerText: {
    fontSize: 18,
    color: '#808080',
  },
});

export default AccountDetailsScreen;
