import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, COLORS } from '../utils/constants';

import AdminDashboard from '../screens/admin/AdminDashboard';
import StudentsListScreen from '../screens/admin/StudentsListScreen';
import StudentDetailScreen from '../screens/admin/StudentDetailScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primaryDark },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={ROUTES.ADMIN_DASHBOARD}
        component={AdminDashboard}
        options={{ title: 'Panel de Administración', headerBackVisible: false }}
      />
      <Stack.Screen
        name={ROUTES.STUDENTS_LIST}
        component={StudentsListScreen}
        options={{ title: 'Estudiantes', headerBackTitle: 'Panel' }}
      />
      <Stack.Screen
        name={ROUTES.STUDENT_DETAIL}
        component={StudentDetailScreen}
        options={({ route }) => ({
          title: route.params?.studentName || 'Detalle del Estudiante',
          headerBackTitle: 'Estudiantes',
        })}
      />
    </Stack.Navigator>
  );
}
