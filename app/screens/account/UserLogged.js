import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";

import Loading from "../../components/Loading";
import InfoUser from "../../components/account/InfoUser";
import AccountOptions from "../../components/account/AccountOptions";

export default function UserLogged(){
    const [userInfo, setuserInfo] = useState(null);
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [reloadUserInfo, setReloadUserInfo] = useState(false);
    const toastRef = useRef();

    //un usuario logueado visualizará este componente al ingresar a Account
    //permite al usuario ver su informacion de cuenta y la posibilidad de cambiar datos en la misma

    useEffect( () => { //si hay cambios en el perfil, se actualizaran automaticamente, sin necesaidad de refrescar
        (async () => {
            const user = await firebase.auth().currentUser;
            setuserInfo(user)
            }
        )()
        setReloadUserInfo(false);
    }, [reloadUserInfo])

    return(
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser 
                            userInfo={userInfo}
                            toastRef={toastRef}
                            setLoading={setLoading}
                            setLoadingText={setLoadingText}
                        />}
            
            <AccountOptions 
                userInfo={userInfo} 
                toastRef={toastRef}
                setReloadUserInfo={setReloadUserInfo}
            />

            <Button 
                title="Cerrar Sesión" 
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={ () => {firebase.auth().signOut()} }
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading text={loadingText} isVisible={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSessionText: {
        color: "#FB7508",

    }
})