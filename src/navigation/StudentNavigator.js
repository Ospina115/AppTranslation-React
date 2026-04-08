import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES, COLORS } from '../utils/constants';

import HomeScreen from '../screens/student/HomeScreen';
import TopicsScreen from '../screens/student/TopicsScreen';
import LessonScreen from '../screens/student/LessonScreen';
import ChatbotScreen from '../screens/student/ChatbotScreen';
import ProgressScreen from '../screens/student/ProgressScreen';
import ProfileScreen from '../screens/student/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TopicsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={ROUTES.TOPICS}
        component={TopicsScreen}
        options={{ title: 'Temas' }}
      />
      <Stack.Screen
        name={ROUTES.LESSON}
        component={LessonScreen}
        options={({ route }) => ({
          title: route.params?.lessonTitle || 'Lección',
          headerBackTitle: 'Atrás',
        })}
      />
    </Stack.Navigator>
  );
}

export default function StudentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === ROUTES.STUDENT_HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TopicsTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === ROUTES.CHATBOT) {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === ROUTES.PROGRESS) {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === ROUTES.PROFILE) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.STUDENT_HOME}
        component={HomeScreen}
        options={{ title: 'Inicio', tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="TopicsTab"
        component={TopicsStack}
        options={{ title: 'Temas', tabBarLabel: 'Temas' }}
      />
      <Tab.Screen
        name={ROUTES.CHATBOT}
        component={ChatbotScreen}
        options={{ title: 'Chatbot', tabBarLabel: 'Chatbot' }}
      />
      <Tab.Screen
        name={ROUTES.PROGRESS}
        component={ProgressScreen}
        options={{ title: 'Progreso', tabBarLabel: 'Progreso' }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ title: 'Perfil', tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
