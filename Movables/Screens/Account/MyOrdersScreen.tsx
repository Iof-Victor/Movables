import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import OrdersGrid from '../../components/Grids/OrdersGrid'; 
import { api } from '@/utils/api';
import { useRegion } from '@/context/RegionContext';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { region } = useRegion();

  const fetchOrders = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('storage_Key');
      const data = JSON.parse(jsonValue || '{}');
      if (!data?.id) return;

      const res = await api('/api/getOrders', region, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          userId: data.id,
        },
      });

      if (res) {
        setOrders(Array.isArray(res) ? res : []);
      }
    } catch (error: any) {
      console.log('Error fetching orders:', error.message);
      Alert.alert('Failed to load orders');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Here you can see all the orders</Text>
      </View>
      <OrdersGrid orders={orders} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});

export default MyOrdersScreen;
