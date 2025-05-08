import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CartProductCard from '../Cards/CartPoductCard';

interface Product {
  id: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartGridProps {
  products: Product[];
  cartId?: string;
  onChangeQuantity: (quantity: number) => void;
}

const CartGrid = ({ products, cartId, onChangeQuantity }: CartGridProps) => {
  const renderItem = ({ item }: { item: Product }) => (
    <CartProductCard
      productName={item.productName}
      price={item.price}
      image={item.image}
      quantity={item.quantity}
      cartId={cartId}
      productId={item.id}
      onChangeQuantity={onChangeQuantity}
    />
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      style={styles.containerFlatList}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  containerFlatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default CartGrid;
