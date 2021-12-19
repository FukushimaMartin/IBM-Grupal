import React from "react";
import { StyleSheet, View, Text, ActivityIndicator} from "react-native";
import { Overlay } from "react-native-elements";


export default function Loading(props){
    const {isVisible, text} = props;

    //Este componente se utiliza para mostrar un cuadro de carga, para indicar al usuario que debe aguardar
    //Se re-utiliza en la mayor parte de la aplicación

    return(
        <Overlay 
            isVisible = {isVisible}
            windowBackgroundColor = "rgba(0, 0, 0, 0.5)"
            overlayBackgroundColor = "transparent"
            overlayStyle = {styles.overlay}
        >
            <View style= {styles.view}>
                <ActivityIndicator 
                    size="large"
                    color="#FB7508"
                />
                {text && <Text style= {styles.text}> {text} </Text>}
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        height: 100,
        width: 200,
        backgroundColor: "#fff",
        borderColor: "#FB7508",
        borderWidth: 2,
        borderRadius: 10,
    },
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#FB7508",
        textTransform: "uppercase",
        marginTop: 10,
    }
})