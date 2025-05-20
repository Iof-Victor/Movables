

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import ProductGrid from '@/components/Grids/ProductGrid';
import Button from '@/components/Button';
import { api } from '@/utils/api';
import { useRegion } from '@/context/RegionContext'; 

const ProductsScreen = () => {
  const { category } = useLocalSearchParams<{ category: string }>();

  const [cartId, setCartId] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [modalVisibleFilter, setModalVisibleFilter] = useState(false);
  const [modalVisibleSort, setModalVisibleSort] = useState(false);

  const [price, setPrice] = useState<string>();
  const [color, setColor] = useState<string>();
  const [materials, setMaterials] = useState<string>();
  const [sortOrderPrice, setSortOrderPrice] = useState<string>();
  const [sortOrderName, setSortOrderName] = useState<string>();
  const { region } = useRegion(); 
  const priceOptions = ['100', '250', '400'];
  const colorOptions = ['White', 'Black', 'Green', 'Cream', 'Pink', 'Grey', 'Brown'];
  const materialsOptions = ['Wood', 'Plywood', 'Metal', 'Plastic'];
  const sortOrderPrOptions = [
    { label: 'Price: Low to High', value: 'asc' },
    { label: 'Price: High to Low', value: 'desc' },
  ];
  const sortOrderNmOptions = [
    { label: 'From A to Z', value: 'asc' },
    { label: 'From Z to A', value: 'desc' },
  ];

  const getData = async () => {
    try {
      const jsonValue = await SecureStore.getItem('storage_Key');
      const data = JSON.parse(jsonValue || '{}');
      setCartId(data.cartId || '');
    } catch (e) {
      console.log('Error fetching cart ID');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api<any[]>('/api/getAllProducts', region, {
        method: 'GET',
        params: {
          productType:category,
          pageNumber: page,
          nrOfProducts: 6,
        },
      });
  
      if (Array.isArray(res)) setProducts(res);
    } catch (error: any) {
      console.log('Error fetching products:', error.message);
    }
  };
  
  const getFilteredProducts = async () => {
    try {
      const res = await api<any[]>('/api/getFilteredProducts', region, {
        method: 'GET',
        params: {
          productType: category,
          price: price || '',
          material: materials || '',
          color: color || '',
          pageNumber: page,
          nrOfProducts: 6,
        },
      });
  
      if (Array.isArray(res)) {
        setProducts(res);
      } else {
        console.log('Unexpected response format:', res);
        setProducts([]);
      }
    } catch (error: any) {
      console.log('Error fetching filtered products:', error.message);
    }
  };
  
  
  const getSortedProducts = async () => {
    try {
      const res = await api<any[]>('/api/getSortedProducts', region, {
        method: 'GET',
        params: {
          productType:category,
          sortBy: sortOrderPrice ? 'price' : 'name',
          sortOrder: sortOrderPrice || sortOrderName || '',
          pageNumber: page,
          nrOfProducts: 6,
          material: materials || '',
          color: color || '',
        },
      });
  
      if (Array.isArray(res)) {
        setProducts(res);
      } else {
        console.log('Unexpected response format:', res);
        setProducts([]);
      }
    } catch (error: any) {
      console.log('Error fetching sorted products:', error.message);
    }
  };
  

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchProducts();
    getSortedProducts();
  }, [page, sortOrderName, sortOrderPrice]);

  return (
    <View style={styles.productsContainer}>
      <Modal visible={modalVisibleFilter} transparent animationType="fade">
        <ScrollView contentContainerStyle={styles.modalView}>
          <Text style={styles.modalTitle}>Filter Products</Text>
          <View style={styles.pickerWrapper}>
            <Text>Select a Price</Text>
            <Picker
              selectedValue={price}
              onValueChange={(value) => setPrice(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Price" value={undefined} />
              {priceOptions.map((val) => (
                <Picker.Item key={val} label={val} value={val} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Text>Select a Color</Text>
            <Picker
              selectedValue={color}
              onValueChange={(value) => setColor(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Color" value={undefined} />
              {colorOptions.map((val) => (
                <Picker.Item key={val} label={val} value={val.toLowerCase()} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Text>Select a Material</Text>
            <Picker
              selectedValue={materials}
              onValueChange={(value) => setMaterials(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Material" value={undefined} />
              {materialsOptions.map((val) => (
                <Picker.Item key={val} label={val} value={val.toLowerCase()} />
              ))}
            </Picker>
          </View>
          <Button
            onPress={() => {
              getFilteredProducts();
              setModalVisibleFilter(false);
            }}
            label="Apply Filters"
          />
        </ScrollView>
      </Modal>

      <Modal visible={modalVisibleSort} transparent animationType="fade">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sort By</Text>
          <Picker
            selectedValue={sortOrderPrice}
            onValueChange={(value) => {
              setSortOrderPrice(value);
              setSortOrderName(undefined);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Sort by Price" value={undefined} />
            {sortOrderPrOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
          <Picker
            selectedValue={sortOrderName}
            onValueChange={(value) => {
              setSortOrderName(value);
              setSortOrderPrice(undefined);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Sort by Name" value={undefined} />
            {sortOrderNmOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
          <Button
            onPress={() => {
              getSortedProducts();
              setModalVisibleSort(false);
            }}
            label="Apply Sort"
          />
        </View>
      </Modal>

      <View style={styles.filtersContainer}>
        <Button
          onPress={() => setModalVisibleFilter(true)}
          label="Filter"
          customStyle={styles.filterButton}
          labelStyle={styles.filteringText}
        />
        <Button
          onPress={() => setModalVisibleSort(true)}
          label="Sort"
          customStyle={styles.filterButton}
          labelStyle={styles.filteringText}
        />
      </View>

      <ProductGrid products={products} cartId={cartId} showAddToCart={true} />

      <View style={styles.buttonsContainer}>
        {page > 1 && (
          <TouchableOpacity
            style={styles.buttonPrev}
            onPress={() => setPage(page - 1)}
          >
            <Text style={styles.buttonText}>Prev Page</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.buttonNext}
          onPress={() => setPage(page + 1)}
        >
          <Text style={styles.buttonText}>Next Page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productsContainer: { flex: 1 },
  modalView: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  pickerWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  filteringText: {
    fontSize: 16,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonPrev: {
    backgroundColor: '#284B63',
    padding: 10,
    borderRadius: 10,
  },
  buttonNext: {
    backgroundColor: '#284B63',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProductsScreen;
