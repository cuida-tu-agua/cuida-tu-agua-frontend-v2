import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "@screens/LandingScreen";
import LoginScreen from "@screens/auth/login/LoginScreen";
import RegisterScreen from "@screens/auth/register/RegisterScreen";
import DashboardScreen from "@screens/dashboard/DashboardScreen";
import StatsScreen from "@screens/dashboard/StatsScreen";
import CreateHogarScreen from "@screens/hogares/CreateHogarScreen";
import EditHogarScreen from "@screens/hogares/EditHogarScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      // TEMPORAL para probar: cambiado a "createHogar" para verla apenas arranca la app.
      // Cuando termines de probar, volvé a dejarlo como estaba:
      // initialRouteName={Platform.OS === "web" ? "landing" : "login"}
      initialRouteName="createHogar"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* LANDING (solo web) */}
      <Stack.Screen
        name="landing"
        options={{ cardStyle: { height: "100vh" as any } }}
      >
        {({ navigation }) => (
          <LandingScreen onAccess={() => navigation.navigate("login")} />
        )}
      </Stack.Screen>

      {/* LOGIN (mobile default) */}
      <Stack.Screen name="login">
        {({ navigation }) => (
          <LoginScreen
            goToRegister={() => navigation.navigate("register")}
            onLoginSuccess={() => navigation.replace("dashboard")}
            goBack={() => navigation.navigate("landing")}
          />
        )}
      </Stack.Screen>
      
      {/* REGISTER */}
      <Stack.Screen name="register">
        {({ navigation }) => (
          <RegisterScreen
            goToLogin={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate("login")
            }
          />
        )}
      </Stack.Screen>

      {/* DASHBOARD */}
      <Stack.Screen name="dashboard">
        {({ navigation }) => (
          <DashboardScreen
            onSignOut={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "landing" }],
              })
            }
          />
        )}
      </Stack.Screen>

      {/* STATS */}
      <Stack.Screen name="stats" component={StatsScreen} 
      options={{ cardStyle: { height: "100vh" as any } }}/>

      {/* CREAR HOGAR (HU-008) */}
      <Stack.Screen name="createHogar">
        {({ navigation }) => (
          <CreateHogarScreen
            goBack={() => navigation.navigate("landing")}
            onCreated={() => navigation.navigate("landing")}
          />
        )}
      </Stack.Screen>

      {/* EDITAR HOGAR (HU-009) */}
      <Stack.Screen name="editHogar">
        {({ navigation, route }) => (
          <EditHogarScreen
            hogarId={(route.params as { hogarId: number })?.hogarId}
            goBack={() => navigation.navigate("landing")}
            onSaved={() => navigation.navigate("landing")}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}