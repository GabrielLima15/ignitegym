import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import { Home } from "@screens/Home";
import { History } from "@screens/History";
import { Profile } from "@screens/Profile";
import { Exercise } from "@screens/Exercise";


import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";



type AppRoutes = {
  homeStack: StackRoutes;
  history: undefined;
  profile: undefined;
  exercise: undefined;
}

type StackRoutes = {
  home: undefined;
  exercise: { exerciseId: string };
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>
export type HomeNavigatorRoutesProps = BottomTabNavigationProp<StackRoutes>

const Tab = createBottomTabNavigator<AppRoutes>();
const Stack = createNativeStackNavigator<StackRoutes>();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="exercise" component={Exercise} />
    </Stack.Navigator>
  )
}

export function AppRoutes() {
  const { tokens } = gluestackUIConfig
  const iconSize = tokens.space["6"]

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? "auto" : 96,
          paddingBottom: tokens.space["10"],
          paddingTop: tokens.space["6"],
        }
      }}
    >
      <Tab.Screen name="homeStack" component={HomeStack} options={{ tabBarIcon: ({ color }) => <HomeSvg fill={color} width={iconSize} height={iconSize} /> }} />
      <Tab.Screen name="history" component={History} options={{ tabBarIcon: ({ color }) => <HistorySvg fill={color} width={iconSize} height={iconSize} /> }} />
      <Tab.Screen name="profile" component={Profile} options={{ tabBarIcon: ({ color }) => <ProfileSvg fill={color} width={iconSize} height={iconSize} /> }} />
    </Tab.Navigator>
  )
}