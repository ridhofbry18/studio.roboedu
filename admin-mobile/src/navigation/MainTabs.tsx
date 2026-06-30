import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, School, CheckSquare, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '../theme/colors';

// Import Screens (we will create these next)
import DashboardScreen from '../screens/DashboardScreen';
import TeamsScreen from '../screens/TeamsScreen';
import SchoolsScreen from '../screens/SchoolsScreen';
import ApprovalsScreen from '../screens/ApprovalsScreen';
import MediaVaultScreen from '../screens/MediaVaultScreen';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primaryContainer,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: 'bold',
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Teams" 
        component={TeamsScreen} 
        options={{
          tabBarIcon: ({ color }) => <Users color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Schools" 
        component={SchoolsScreen} 
        options={{
          tabBarIcon: ({ color }) => <School color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Approvals" 
        component={ApprovalsScreen} 
        options={{
          tabBarIcon: ({ color }) => <CheckSquare color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Media" 
        component={MediaVaultScreen} 
        options={{
          tabBarIcon: ({ color }) => <ImageIcon color={color} size={24} />
        }}
      />
    </Tab.Navigator>
  );
};
