import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import ModelStatusBar from '../../src/components/ModelStatusBar';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Wardrobe',
          headerRight: () => <ModelStatusBar />,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👗" label="Wardrobe" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Item',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="➕" label="Add" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: 'Builder',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="✨" label="Builder" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="looks"
        options={{
          title: 'Looks',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📸" label="Looks" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FAFAFA',
    borderTopColor: '#EBEBEB',
    height: 64,
    paddingBottom: 8,
  },
  header: {
    backgroundColor: '#FAFAFA',
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EBEBEB',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tabIcon: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 6,
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.45,
  },
  tabEmojiFocused: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#AAA',
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: '#1A1A1A',
  },
});
