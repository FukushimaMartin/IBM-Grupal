import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Favorites from "../screens/Favorites"

const Stack = createStackNavigator();

export default function FavoritesStack(){
    /*Este componente posee la estructura utilizada en otros componentes relacionados con la navegacion
    Si en un futuro se desean adicionar screen al componente Favoritos, entonces se deberán colocar en 
    esta pila de screen*/
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="favorites"
                component={Favorites}
                options={ {title: "Ciudades Favoritas"} }
            />
        </Stack.Navigator>
    )
}
 
