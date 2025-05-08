import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import axios from 'axios';

interface QuantityButtonProps {
  quantity: number;
  cartId?: string;
  productId: string;
  onChangeQuantity: (newQuantity: number) => void;
}

const QuantityButton = ({ quantity, cartId, productId, onChangeQuantity }: QuantityButtonProps) => {
  const [quantityButton, setQuantityButton] = useState(quantity);

  const addToCart = async () => {
    try {
      await axios.post('/addToCart', { productId, cartId });
    } catch (error) {
      console.log('Cannot add to cart', error);
    }
  };

  const deleteFromCart = async () => {
    try {
      await axios.post('/deleteProductFromCart', { productId, cartId });
    } catch (error) {
      console.log('Cannot remove from cart', error);
    }
  };

  useEffect(() => {
    setQuantityButton(quantity);
  }, [quantity]);

  const handleIncrease = () => {
    addToCart();
    const newQuantity = quantityButton + 1;
    setQuantityButton(newQuantity);
    onChangeQuantity(newQuantity);
  };

  const handleDecrease = () => {
    if (quantityButton > 0) {
      deleteFromCart();
      const newQuantity = quantityButton - 1;
      setQuantityButton(newQuantity);
      onChangeQuantity(newQuantity);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDecrease} disabled={quantityButton <= 0}>
        <MaterialCommunityIcons name="minus" size={20} color={quantityButton <= 0 ? '#ccc' : 'black'} />
      </TouchableOpacity>

      <Text style={styles.textQuantity}>{quantityButton}</Text>

      <TouchableOpacity onPress={handleIncrease}>
        <MaterialCommunityIcons name="plus" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#6c757d',
    borderRadius: 8,
    width: 100,
    height: 35,
    backgroundColor: 'white',
  },
  textQuantity: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default QuantityButton;
