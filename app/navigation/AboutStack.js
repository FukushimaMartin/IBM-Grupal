import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import About from "../screens/About";

const Stack = createStackNavigator();

export default function AboutStack() {
  /*Este componente posee la estructura utilizada en otros componentes relacionados con la navegacion
    Si en un futuro se desean adicionar screen al componente Search, entonces se deberán colocar en 
    esta pila de screen*/
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="about"
        component={About}
        options={{ title: "Acerca de nosotros" }}
      />
    </Stack.Navigator>
  );
}
