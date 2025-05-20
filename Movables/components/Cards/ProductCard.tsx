import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { useRegion } from '@/context/RegionContext';
import { api } from '@/utils/api';

interface ProductCardProps {
  productName: string;
  price: number;
  image: string;
  productId: string;
  cartId?: string;
  showAddToCart: boolean;
  productColor?: string;
  product?: any; // Adjust the type as per your product structure
}

const ProductCard = ({
  productName,
  price,
  image,
  productId,
  cartId,
  showAddToCart,
  productColor,
  product,
}: ProductCardProps) => {
  const { region }= useRegion();

  const handleNavigate = () => {
    router.push({
      pathname: '/home/[category]/[productId]',
      params: {
        category: 'sofa', 
        productId,
        productName,
        image,
        productColor,
      },
    });
  };


  const addToCart = async () => {
    try {
      console.log('Calling addToCart with:', { region, productId, cartId });

      await api('/api/addToCart', region , {
        method: 'POST',
        body: JSON.stringify({ productId,cartId }),
      });
      Alert.alert('Added to cart!');
    } catch (error: any) {
      console.log('Cannot add to cart:', error.message);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <Image source={{ uri: image }} style={styles.logo} />
      <View style={styles.productTitle}>
        <Text style={styles.title}>{productName}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}$</Text>
      </View>

      {showAddToCart && (
        <View>
          <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    paddingVertical: 10,
  },
  logo: {
    resizeMode: 'contain',
    height: 120,
    width: 120,
    borderRadius: 10,
  },
  productTitle: {
    marginTop: 10,
    marginBottom: 10,
  },
  priceContainer: {
    paddingTop: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 13,
  },
  cartButton: {
    backgroundColor: '#153243',
    marginTop: 8,
    marginBottom: 5,
    width: 100,
    borderRadius: 50,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartText: {
    fontSize: 14,
    color: 'white',
  },
});

export default ProductCard;
