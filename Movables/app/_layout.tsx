import { Tabs } from 'expo-router';

import { FontAwesome } from '@expo/vector-icons';


export default function TabLayout() {

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
