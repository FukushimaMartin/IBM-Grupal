import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import FavoritesStack from "./FavoritesStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";
import CitiesStack from "./CitiesStack";
import About from "./AboutStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  /*Componente principal de navegacion, posee las screen principales de la app, las cuales se podrán navegar
    a traves de una barra de navegacion colocada en la parte inferior de la app*/
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="account"
        tabBarOptions={{
          inactiveTintColor: "#646464",
          activeTintColor: "#FB7508",
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
      >
        <Tab.Screen
          name="cities"
          component={CitiesStack}
          options={{ title: "Ciudades" }}
        />

        <Tab.Screen
          name="favorites"
          component={FavoritesStack}
          options={{ title: "Favoritos" }}
        />
        <Tab.Screen
          name="search"
          component={SearchStack}
          options={{ title: "Búsqueda" }}
        />
        <Tab.Screen
          name="account"
          component={AccountStack}
          options={{ title: "Mi cuenta" }}
        />
        <Tab.Screen
          name="about"
          component={About}
          options={{ title: "Nosotros" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "favorites":
      iconName = "heart-outline";
      break;
    case "search":
      iconName = "magnify";
      break;
    case "account":
      iconName = "home-outline";
      break;
    case "cities":
      iconName = "earth";
      break;
    case "about":
      iconName = "account-group";
      break;
    default:
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
