import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas principais
import SplashScreen from '../screens/SplashScreen';
import DashboardScreen from '../screens/DashboardScreen';

// Módulos técnicos antigos
import RoscasScreen from '../screens/RoscasScreen';
import EngrenagensScreen from '../screens/EngrenagensScreen';
import RpmVcScreen from '../screens/RpmVcScreen';
import ConeScreen from '../screens/ConeScreen';
import PerfisScreen from '../screens/PerfisScreen';
import DivisorScreen from '../screens/DivisorScreen';
import FuracaoPcdScreen from '../screens/FuracaoPcdScreen';
import AjustesScreen from '../screens/AjustesScreen';
import TrigonometriaScreen from '../screens/TrigonometriaScreen';

// Módulos novos
import ConversoesScreen from '../screens/ConversoesScreen';
import MateriaisScreen from '../screens/MateriaisScreen';
import RecartilhasScreen from '../screens/RecartilhasScreen';

// Telas institucionais
import ConfigScreen from '../screens/ConfigScreen';
import ManualScreen from '../screens/ManualScreen';
import SobreScreen from '../screens/SobreScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'none'
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        <Stack.Screen name="Roscas" component={RoscasScreen} />
        <Stack.Screen name="Engrenagens" component={EngrenagensScreen} />
        <Stack.Screen name="RpmVc" component={RpmVcScreen} />
        <Stack.Screen name="Cone" component={ConeScreen} />
        <Stack.Screen name="Perfis" component={PerfisScreen} />
        <Stack.Screen name="Divisor" component={DivisorScreen} />
        <Stack.Screen name="FuracaoPcd" component={FuracaoPcdScreen} />
        <Stack.Screen name="Ajustes" component={AjustesScreen} />
        <Stack.Screen name="Trigonometria" component={TrigonometriaScreen} />

        <Stack.Screen name="Conversoes" component={ConversoesScreen} />
        <Stack.Screen name="Materiais" component={MateriaisScreen} />
        <Stack.Screen name="Recartilhas" component={RecartilhasScreen} />

        <Stack.Screen name="Config" component={ConfigScreen} />
        <Stack.Screen name="Manual" component={ManualScreen} />
        <Stack.Screen name="Sobre" component={SobreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}