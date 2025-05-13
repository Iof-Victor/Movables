import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React,{ useEffect,useState } from 'react';
import { RegionProvider,useRegion } from '@/context/RegionContext';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native';


export default function TabLayout() {
  return (
    <RegionProvider>
      <AppTabs />
    </RegionProvider>)
}

const AppTabs = () => {
  const { setRegion } = useRegion();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
       
        let region: "EU" | "US" | "ASIA" = "EU"; 
        if (latitude > 0 && longitude < -30) region = "US";
        else if (latitude < 0 && longitude > 60) region = "ASIA";
    
        setRegion(region); 
      } catch (error) {
        console.error('Error fetching location:', error);
      }finally {
        setLoading(false); 
      }
    };

    fetchRegion();
  }, []);

  if(loading) {
    return (
      <ActivityIndicator />
    )}

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { borderTopColor: 'rgba(0,0,0,0.8)' },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <FontAwesome name="home" size={15} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: () => <FontAwesome name="shopping-cart" size={15} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: () => <FontAwesome name="user-circle" size={15} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          href: null, // Exclude this route from the tab bar
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Exclude this route from the tab bar
        }}
      />
    </Tabs>
  );
}
