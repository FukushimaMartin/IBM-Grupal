import React, {useState} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import {size} from "lodash";

import {reauthenticate} from "../../utils/api";

export default function ChangePasswordForm(props){
    const {setShowModal, toastRef} = props
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (event, type) => {
        setFormData({ ...formData, [type]: event.nativeEvent.text})
    }

    const onSubmit =  async () => {
        /*Este método (luego de validar que se cumplan las condiciones previstas) actualiza en firebase
        la contraseña del usuario*/
        let isSetError = true;
        let errorTemp = {}
        setError({});

        if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
            errorTemp = {
                password: !formData.password ? "La contraseña no puede estar vacía." : "",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacía." : "",
                repeatNewPassword: !formData.repeatNewPassword ? "La contraseña no puede estar vacía." : "",
            }
        } else if(formData.newPassword !== formData.repeatNewPassword){
            errorTemp = {
                newPassword: "Las contraseñas no son iguales.",
                repeatNewPassword: "Las contraseñas no son iguales."
            }
        } else if(size(formData.newPassword) < 6){
            errorTemp = {
                newPassword: "La contraseña debe ser mayor a 6 carácteres",
                repeatNewPassword: "La contraseña debe ser mayor a 6 carácteres"
            }
        } else {
            setIsLoading(true);

            await reauthenticate(formData.password)
                .then(async () => {
                    await firebase
                        .auth()
                        .currentUser.updatePassword(formData.newPassword)
                        .then(() => {
                            isSetError = false;
                            setIsLoading(false);
                            setShowModal(false);
                            firebase.auth().signOut();
                        })
                        .catch(() => {
                            errorTemp= {
                                other: "Error al actualizar la contraseña"
                            }
                            setIsLoading(false);
                        })
                })
                .catch(() => {
                    setIsLoading(false);
                    errorTemp = {
                        password: "La contraseña no es correcta."
                    }
                })
        }

        isSetError && setError(errorTemp)
    }


    return(
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={ event => onChange(event, "password")}
                errorMessage={error.password}
            />
            <Input
                placeholder="Contraseña nueva"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={ event => onChange(event, "newPassword")}
                errorMessage={error.newPassword}
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={ event => onChange(event, "repeatNewPassword")}
                errorMessage={error.repeatNewPassword}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{error.other}</Text>
        </View>
    )
}

function defaultValue(){
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: "",
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,

    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#FB7508"
    }
})