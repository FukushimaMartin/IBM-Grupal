import React, {useState} from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

import {validateEmail} from "../../utils/validations";
import {reauthenticate} from "../../utils/api";


export default function ChangeEmailForm(props){
    const {email, setShowModal, toastRef, setReloadUserInfo} = props
    const [formData, setFormData] = useState(defaultValue())
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (event, type) => {
        setFormData( {...formData, [type]: event.nativeEvent.text} )
    }

    const onSubmit = () => {
        /*Este método (luego de validar que se cumplan las condiciones previstas) actualiza en firebase
        el email de usuario ( debe colocar su contraseña para confirmar) */
        setError({})
        
        if(!formData.email || email === formData.email){
            setError({
                email: "El email no ha cambiado."
            })
        } else if(!validateEmail(formData.email)) {
            setError({
                email: "Email incorrecto."
            })
        } else if(!formData.password) {
            setError({
                password: "Debe verificar la contraseña."
            })
        } else {
            setIsLoading(true)
            reauthenticate(formData.password)
                .then( () => {
                    firebase.auth().currentUser
                        .updateEmail(formData.email)
                        .then(() => {
                            setIsLoading(false)
                            setReloadUserInfo(true)
                            toastRef.current.show("Email actualizado correctamente.")
                            setShowModal(false)
                        })
                        .catch( () => {
                            setError({ email: "Error al actualizar el email."})
                            setIsLoading(false)
                        })
                })
                .catch( () => {
                    setIsLoading(false)
                    setError({
                        password: "La contraseña no es correcta."
                    })
                })
        }
    }

    return (
        // Este componente muestra al usuario los campos a completar para gestionar su peticion
        <View style={styles.view}>
            <Input 
                placeholder="Correo Electronico"
                containerStyle={styles.input}
                defaultValue={email || ""}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                onChange={(event) => onChange(event, "email")}
                errorMessage={error.email}
            />
            <Input
                placeholder="Verificar contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(event) => onChange(event, "password")}
                errorMessage={error.password}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

function defaultValue(){
    return {
        email: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        paddingTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#FB7508"
    }
})