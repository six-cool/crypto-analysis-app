import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home.screen';
import Profile from '../screens/Profile/Profile.screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Signup from '../screens/Signup/Signup.screen';
import Login from '../screens/Login/Login.screen';
import InputInfo from '../screens/InputInfo/InputInfo.screen';
import { connectToDatabase, createTables } from '../db/sale.db';
import { AuthProvider } from '../contexts/AuthContexts';
import { DBProvider } from '../contexts/DBContexts';
import { I18nextProvider } from 'react-i18next';
import i18n from '../utils/i18n';
import ShowInfo from '../screens/ShowInfo/ShowInfo.screen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Input">
      <Tab.Screen
        name="Input"
        component={InputInfo}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }: any) => {
            return <Icon name={'add-outline'} size={25} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Table"
        component={ShowInfo}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }: any) => {
            return <Icon name={'reader-outline'} size={25} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const MainNavigation = () => {
  const loadDB = async () => {
    const db = await connectToDatabase();
    createTables(db);
  };
  useEffect(() => {
    loadDB();
  }, []);
  return (
    <NavigationContainer>
      <AuthProvider>
        <DBProvider>
          <I18nextProvider i18n={i18n}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="HomeBase"
                options={{ headerShown: false }}
                component={MyTabs}
              />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              {/* add your another screen here using -> Stack.Screen */}
            </Stack.Navigator>
          </I18nextProvider>
        </DBProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default MainNavigation;
