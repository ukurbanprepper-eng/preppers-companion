import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { PrepperHeader } from '@/components/PrepperHeader';

export default function TabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        headerTitle: () => <PrepperHeader />,
        headerTitleAlign: 'left',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          marginBottom: 1,
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="chart.bar.fill" tintColor={color} size={20} />
            ) : (
              <Feather name="home" size={18} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="archivebox.fill" tintColor={color} size={20} />
            ) : (
              <Feather name="package" size={18} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="medicines"
        options={{
          title: 'Meds',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="pill.fill" tintColor={color} size={20} />
            ) : (
              <FontAwesome5 name="pills" size={16} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="cart.fill" tintColor={color} size={20} />
            ) : (
              <Feather name="shopping-cart" size={18} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="heart.fill" tintColor={color} size={20} />
            ) : (
              <Feather name="activity" size={18} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="gearshape.fill" tintColor={color} size={20} />
            ) : (
              <Feather name="settings" size={18} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
