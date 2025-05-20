import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Button from '@/components/Button';
import { api } from '@/utils/api';
import { useRegion } from '@/context/RegionContext';

type UserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

const MyAccountScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [id, setId] = useState('');
  const { region } = useRegion();

  const getData = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('storage_Key');
      const data = JSON.parse(jsonValue || '{}');
      if (data?.id) {
        fetchUserDetails(data.id);
        setId(data.id);
      }
    } catch (e) {
      console.log('Error fetching secure storage');
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const res = await api<UserDetails>('/api/getUserDetails', region, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
  
      if (res) {
        setEmail(res.email);
        setFirstName(res.firstName);
        setLastName(res.lastName);
        setPhoneNumber(res.phoneNumber);
        setAddress(res.address);
      }
    } catch (error: any) {
      console.log('Error fetching user details:', error.message);
    }
  };

  const saveUserDetails = async () => {
    try {
      const res = await api('/api/updateUserDetails', region, {
        method: 'POST',
        body: JSON.stringify({
          id,
          firstName,
          lastName,
          phoneNumber,
          address,
        }),
      });

      if (res) {
        Alert.alert('Success', 'Details saved successfully');
        router.back(); 
      }
    } catch (error: any) {
      console.log('Error saving user details:', error.message);
      Alert.alert('Error', 'Could not update details');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            value={firstName}
            placeholder="First Name"
            style={styles.textInput}
            autoCapitalize="words"
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={lastName}
            placeholder="Last Name"
            style={styles.textInput}
            autoCapitalize="words"
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            editable={false}
            value={email}
            placeholder="Email"
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={phoneNumber}
            placeholder="Phone Number"
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={address}
            placeholder="Address"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={setAddress}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            customStyle={styles.editAccountButton}
            onPress={saveUserDetails}
            label={'Save Changes'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputView: {
    marginVertical: 10,
    width: '100%',
  },
  textInput: {
    backgroundColor: '#D9D9D9',
    height: 70,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  editAccountButton: {
    backgroundColor: '#9EB7B8',
    width: 200,
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyAccountScreen;