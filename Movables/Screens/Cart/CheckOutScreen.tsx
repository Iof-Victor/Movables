import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { api } from '@/utils/api'; 
import { useRegion } from '@/context/RegionContext';

type UserDetails = {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
};


const CheckOutScreen = () => {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total: string }>();
  const { region } = useRegion();
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState('');

  const getData = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('storage_Key');
      const data = JSON.parse(jsonValue || '{}');
      if (data?.id) {
        setUserId(data.id);
        fetchUserDetails(data.id);
      }
    } catch (e) {
      console.log('Error loading user data');
    }
  };

  const fetchUserDetails = async (id: string) => {
    try {
      const res = await api<UserDetails>('/api/getUserDetails', region, {
        method: 'POST',
        body: JSON.stringify({ userId: id }),
      });

      if (res) {
        setFirstName(res.firstName);
        setLastName(res.lastName);
        setPhoneNumber(res.phoneNumber);
        setAddress(res.address);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log('Error fetching user details:', e.message);
      } else {
        console.log('Error fetching user details:', e);
      }
    }
  };

  const createOrder = async () => {
    try {
      const res = await api('/api/createOrder', region, {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          totalSum: total,
          address,
          phoneNumber,
          userId,
        }),
      });

      if (res) {
        Alert.alert('Success', 'Order created successfully');
        router.push('/cart/payment');
      }
    } catch (e: any) {
      Alert.alert('Error', 'Could not create order');
      console.log('Error creating order:', e.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  return (
    <ScrollView style={styles.scrollStyle}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CheckOut</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            value={firstName}
            placeholder="First Name"
            style={styles.textInput}
            editable={false}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={lastName}
            placeholder="Last Name"
            style={styles.textInput}
            editable={false}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={address}
            placeholder="Address"
            style={styles.textInput}
            onChangeText={setAddress}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={phoneNumber}
            placeholder="Phone Number"
            style={styles.textInput}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.totalPrice}>
          <Text style={styles.price}>{total}</Text>
        </View>
        <TouchableOpacity style={styles.paymentButton} onPress={createOrder}>
          <Text style={styles.paymentText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollStyle: {
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 18,
    color: '#808080',
  },
  inputView: {
    marginVertical: 10,
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#D9D9D9',
    height: 70,
    width: 350,
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  paymentButton: {
    backgroundColor: '#284B63',
    marginTop: 30,
    width: 250,
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    fontSize: 15,
    color: 'white',
  },
  totalPrice: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 30,
    paddingVertical: 15,
    width: 200,
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#284B63',
  },
});

export default CheckOutScreen;