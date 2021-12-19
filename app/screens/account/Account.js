import React, { useState, useEffect } from "react";
import * as firebase from "firebase";

import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import Loading from "../../components/Loading";


export default function Account(){
    //Este componente verifica si hay un usuario conectado, en caso afirmativo muestra el componente UserLogged
    //en caso contrario, mostrara el componente UserGuest
    const [login, setLogin] = useState(null);

    useEffect( () => {
        firebase.auth().onAuthStateChanged( (user) => {
            !user ? setLogin(false) : setLogin(true);
        })
    }, [] );

    if (login === null) return <Loading isVisible={true} text="Cargando..."/>;

    return login ? <UserLogged /> : <UserGuest />;
}
