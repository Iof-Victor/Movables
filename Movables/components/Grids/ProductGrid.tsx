import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../Cards/ProductCard';

interface Product {
  id: string;
  productName: string;
  price: number;
  image: string;
  color?: string;
}

interface ProductGridProps {
    products: Product[];
    showAddToCart: boolean;
    cartId?: string;
}

const mockProducts: Product[] = [
    {
        id: '1',
        productName: 'Product 1',
        price: 29.99,
        image: 'https://via.placeholder.com/150',
        color: 'red',
    },
    {
        id: '2',
        productName: 'Product 2',
        price: 49.99,
        image: 'https://via.placeholder.com/150',
        color: 'blue',
    },
    {
        id: '3',
        productName: 'Product 3',
        price: 19.99,
        image: 'https://via.placeholder.com/150',
        color: 'green',
    },
];

const ProductGrid = ({ products, showAddToCart, cartId }: ProductGridProps) => {
  const renderRow = ({ item }: { item: Product[] }) => (
    <View style={styles.gridRow}>
      {item.map((product) => (
        <ProductCard
          key={product.id}
          productName={product.productName}
          price={product.price}
          image={product.image}
          productId={product.id}
          cartId={cartId}
          showAddToCart={showAddToCart}
          productColor={product.color}
        />
      ))}
    </View>
  );


  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push(products.slice(i, i + 2));
  }

  return (
    <FlatList
      data={rows}
      renderItem={renderRow}
      keyExtractor={(_, index) => index.toString()}
      keyboardShouldPersistTaps="handled"
      style={styles.containerFlatList}
    />
  );
};

const styles = StyleSheet.create({
  containerFlatList: {
    flex: 1,
    paddingHorizontal: 1,
  },
  gridRow: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductGrid;
