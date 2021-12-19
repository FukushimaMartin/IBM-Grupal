import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from  "firebase";
import * as ImagePicker from "expo-image-picker";
import { Camera } from 'expo-camera';


export default function InfoUser(props){
    const { userInfo: {uid, photoURL, displayName, email},
        toastRef,
        setLoading,
        setLoadingText
    } = props;

    const changeAvatar = async () => {
        /*Este método permite al usuario cambiar la imagen de su perfil
        Debe aceptar los permisos para acceder a la galeria del telefono*/

        const resultPermissions = await Camera.requestCameraPermissionsAsync();
        const resultPermissionsCamera = resultPermissions.status;

        if(resultPermissionsCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria")
        } else {
            //se ajusta la resolución de la imagen
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            });

            if(result.cancelled) {
                toastRef.current.show("Has cancelado la selección de imagen")
            } else {
                uploadImage(result.uri)
                    .then( () => { updatePhotoUrl() } ) //imagen cargada
                    .catch( () => {
                        toastRef.current.show("Error al cargar la imagen")
                    })
            }
        }
    }

    const uploadImage = async (uri) => {
        setLoadingText("Actualizando avatar");
        setLoading(true);

        //como la función es asíncrona, no puede avanzar hacia la siguiente instrucción hasta terminar con esta
        const response = await fetch(uri);
        
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatar/${uid}`)

        return ref.put(blob)
    }

    const updatePhotoUrl = () => {
        //se actualiza la imagen en firebase
        firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then( async (response) => {
                const update = { photoURL: response }
                await firebase.auth().currentUser.updateProfile(update);
                setLoading(false);
            })
            .catch( () => {
                toastRef.current.show("Error al cargar la imagen")
            })
    }


    return(
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={photoURL ? {uri: photoURL} : require("../../../assets/img/avatar-default.jpg")}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : "Social Login"}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    }
})