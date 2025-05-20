import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import axios from 'axios';
import { api } from '@/utils/api';
import { useRegion } from '@/context/RegionContext'; // Import useRegion

interface QuantityButtonProps {
  quantity: number;
  cartId?: string;
  productId: string;
  onChangeQuantity: (newQuantity: number) => void;
}

const QuantityButton = ({ quantity, cartId, productId, onChangeQuantity }: QuantityButtonProps) => {
  const [quantityButton, setQuantityButton] = useState(quantity);
  const { region } = useRegion(); 

  const addToCart = async () => {
    try {
      await api('api/addToCart', region || "EU", { method:"POST",body: JSON.stringify({productId, cartId })});
    } catch (error) {
      console.log('Cannot add to cart', error);
    }
  };

  const deleteFromCart = async () => {
    try {
      console.log('Calling deleteFromCart with:', { region, productId, cartId });
  
      await api('/deleteProductFromCart', region || "EU", {
        method: "POST",
        body: JSON.stringify({ productId, cartId }),
      });
  
      console.log('Product successfully removed from cart');
    } catch (error: any) {
      console.error('Cannot remove from cart:', error.message);
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
