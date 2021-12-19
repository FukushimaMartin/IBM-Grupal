import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Account from "../screens/account/Account";
import Login from "../screens/account/Login";
import Register from "../screens/account/Register";

const Stack = createStackNavigator();

export default function AccountStack(){
    //Este componente posee una pila de screen relacionadas con la cuenta de usuario
    //Según se desplace el usuario se ejecutará una screen u otra
    return(
        <Stack.Navigator screenOptions={{
            headerStyle: { elevation: 0 },
            cardStyle: { backgroundColor: '#fff' }
        }}>
            <Stack.Screen
                name="account"
                component={Account}
                options={ {title: "Mi Cuenta"} }
            />
             <Stack.Screen
                name= "login"
                component= {Login} 
                options={ {title: "Iniciar sesión"} }
            />
            <Stack.Screen
                name= "register"
                component= {Register} 
                options={ {title: "Registro"} }
            />
        </Stack.Navigator>
    )
}
