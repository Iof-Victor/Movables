import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import CartGrid from '../../components/Grids/CartGrid';
import { api } from '@/utils/api'; 
import { useRegion } from '@/context/RegionContext';

const CartScreen = () => {
  const [cartId, setCartId] = useState<string | undefined>();
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState('');
  const [changedQuantity, setChangedQuantity] = useState(false);
  const { region } = useRegion();

  const onChangeQuantity = (q: number) => {
    if (q < 1 && cartId) {
      fetchProducts(cartId);
    }
    setChangedQuantity((prev) => !prev);
  };

  const fetchProducts = async (cartId: string) => {
    try {
      const res = await api('/api/showProductsInCart', region, {
        method: 'POST',
        body: JSON.stringify({ cartId }),
      });

      if (Array.isArray(res)) {
        const productArray = res.map((item: any) => {
          const product = { ...item.__product__, quantity: item.quantity };
          return product;
        });
        setProducts(productArray);
      } else {
        console.log('Unexpected response format:', res);
      }
    } catch (error: any) {
      console.log('Error fetching products:', error.message);
    }
  };

  const fetchTotalSum = async (cartId: string) => {
    try {
      const res = await api('/api/calculateCartTotalSum', region, {
        method: 'POST',
        body: JSON.stringify({ cartId }),
      });

      if (res) {
        setTotal(String(res));
      }
    } catch (error: any) {
      console.log('Error fetching total:', error.message);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('storage_Key');
      const data = JSON.parse(jsonValue || '{}');
      if (data?.cartId) {
        setCartId(data.cartId);
        await fetchProducts(data.cartId);
        await fetchTotalSum(data.cartId);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load cart info.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [changedQuantity])
  );

  return (
    <View style={styles.container}>
      <CartGrid
        products={products}
        cartId={cartId}
        onChangeQuantity={onChangeQuantity}
      />
      <View style={{ alignItems: 'center' }}>
        <View style={styles.totalPrice}>
          <Text style={styles.price}>{total}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkOutButton}
          onPress={() =>
            router.push({
              pathname: '/cart/checkout',
              params: { total },
            })
          }
        >
          <Text style={styles.checkOutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  totalPrice: {
    borderColor: '#000000',
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
  checkOutButton: {
    backgroundColor: '#284B63',
    marginTop: 20,
    marginBottom: 15,
    width: 230,
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOutText: {
    fontSize: 18,
    color: 'white',
  },
});

export default CartScreen;