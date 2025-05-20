import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { api } from '@/utils/api'; 
import { useRegion } from '@/context/RegionContext'; 

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
    const { region } = useRegion(); 

  const saveData = async (data: any) => {
    try {
      const jsonValue = JSON.stringify(data);
      await SecureStore.setItemAsync('storage_Key', jsonValue); 
    } catch (e) {
      console.log('Error saving data:', e);
    }
  };

  const handleAuth = async () => {
    if (email.trim() && password.trim()) {
      try {
        const res = await api('/api/loginUser', region, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        if (res) {
        console.log('res', res);
        saveData(res); 
        router.replace('/account'); 
        }
      } catch (error: any) {
        if (error.message) {
          setAlertMessage(error.message);
        } else {
          setAlertMessage('Login failed. Please try again.');
        }
      }
    } else {
      setAlertMessage('Please fill in all the fields!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {alertMessage.length > 0 && (
        <Text style={styles.errorAlert}>{alertMessage}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleAuth} />
        <Button
          title="Signup"
          onPress={() => router.push('/account/register')} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  errorAlert: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default AuthScreen;