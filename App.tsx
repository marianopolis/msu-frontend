import React, { useEffect } from "react";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { View, StyleSheet, Image, Text, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Config from "react-native-config";
import SplashScreen from "react-native-splash-screen";

import PostsScreen from "./src/PostsScreen";
import FilesScreen from "./src/FilesScreen";
// import FormsScreen from "./src/FormsScreen";
import CalendarScreen from "./src/CalendarScreen";
import CongressScreen from "./src/CongressScreen";

const MSU_LOGO = require("./assets/logo-white.png");
import messaging from "@react-native-firebase/messaging";
import {requestUserPermission} from "./notifications.js";

const icons: { [key: string]: any } = {
  Posts: "chat",
  Resources: "info",
  Forms: "note",
  Calendar: "event",
  Congress: "people",
};

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
  },
  headerImage: {
    height: 38,
    resizeMode: "contain",
  },
  errorRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

const TabNav = createBottomTabNavigator();
const TabNavScreen = () => (
  <TabNav.Navigator
    initialRouteName="Posts"
    tabBarOptions={{
      labelStyle: styles.label,
    }}
    screenOptions={({ route }: any) => ({
      tabBarIcon: ({ color, size }: any) => (
        <MaterialIcon name={icons[route.name]} color={color} size={size} />
      ),
    })}
  >
    <TabNav.Screen name="Posts" component={PostsScreen} />
    <TabNav.Screen name="Resources" component={FilesScreen} />
    {/* <TabNav.Screen name="Forms" component={FormsScreen} /> */}
    <TabNav.Screen name="Calendar" component={CalendarScreen} />
    <TabNav.Screen name="Congress" component={CongressScreen} />
  </TabNav.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = () => (
  <RootStack.Navigator
    screenOptions={{
      headerTitleAlign: "center",
    }}
  >
    <RootStack.Screen
      name="Home"
      component={TabNavScreen}
      options={{
        headerTitle: () => (
          <Image source={MSU_LOGO} style={styles.headerImage} />
        ),
      }}
    />
  </RootStack.Navigator>
);

// List of environment variables that must be set in .env.
// If they are not set, the App prints and displays an error.
const CONFIG_VARS = ["SERVER_URL"];

const App = () => {
  // Ensure all env variables are set. If any is not, print missing variables.
  if (!CONFIG_VARS.every(x => x in Config)) {
    const missing = CONFIG_VARS.filter(x => !(x in Config));
    console.error("Environment variables missing from .env:");
    console.error(`${missing}`);
    return (
      <View style={styles.errorRoot}>
        <Text style={styles.errorTitle}>
          Environment variables are missing from .env:
        </Text>
        {missing.map(x => (
          <Text>{x}</Text>
        ))}
      </View>
    );
  }

  useEffect(() => {
    requestUserPermission();
    SplashScreen.hide();

    messaging()
      .getToken()
      .then(token => console.log(token));
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
};
export default App;
