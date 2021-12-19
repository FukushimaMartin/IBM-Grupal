import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Search from "../screens/Search"

const Stack = createStackNavigator();

export default function SearchStack(){
    /*Este componente posee la estructura utilizada en otros componentes relacionados con la navegacion
    Si en un futuro se desean adicionar screen al componente Search, entonces se deberán colocar en 
    esta pila de screen*/
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="search"
                component={Search}
                options={ {title: "Búsqueda"} }
            />
        </Stack.Navigator>
    )
}
