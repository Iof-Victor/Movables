import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'; // Updated import
import axios from 'axios';
import { useRouter } from 'expo-router';

import ProductGrid from '../components/Grids/ProductGrid';
import Button from '@/components/Button';

const HomePageScreen = () => {
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [products, setProducts] = useState<any>();
  

  const getData = async () => {
    try {
      const jsonValue = await SecureStore.getItem('@storage_Key');
      setData(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      alert('Failed to load user data');
    }
  };

  const fetchRandomProducts = async () => {
    try {
      const res = await axios.get('/getRandomProducts');
      if (res?.data) setProducts(res.data);
    } catch (error: any) {
      if (error.response) {
        console.log('Response error:', error.response);
      } else if (error.request) {
        console.log('Request error:', error.request);
      } else {
        console.log('General error:', error.message);
      }
    }
  };

  useEffect(() => {
    getData();
    fetchRandomProducts();
  }, []);

  const navigateToProducts = (productType: string) => {
    router.push(`/home/${productType}`);
  };

  return (
    <>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome !</Text>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.productSwiper}
        style={styles.container}
      >
          {(
      [
        { icon: 'table-furniture', type: 'table' },
        { icon: 'chair-rolling', type: 'chair' },
        { icon: 'wardrobe', type: 'wardrobe' },
        { icon: 'sofa', type: 'sofa' },
        { icon: 'bed-king', type: 'bed-king' },
      ] as const
    ).map(({ icon, type }) => (
      <TouchableOpacity
        key={type}
        style={styles.productsIcon}
        onPress={() => navigateToProducts(type)}
      >
        <MaterialCommunityIcons name={icon} size={40} color="black" />
      </TouchableOpacity>
    ))}
      </ScrollView>

      <ProductGrid products={products} showAddToCart={false} />

      <View style={styles.buttonContainer}>
        {/* <Button
          label="Products"
          onPress={() => navigateToProducts('')}
          backgroundColor="#9EB7B8"
          width={200}
          height={50}
        /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexGrow: 0,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  welcomeContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
  },
  productSwiper: {
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: 'white',
  },
  productsIcon: {
    padding: 5,
  },
  buttonContainer: {
    flex: 0.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomePageScreen;
