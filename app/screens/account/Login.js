import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import { Divider } from "react-native-elements";

import LoginForm from "../../components/account/LoginForm";

export default function Login() {
  const toastRef = useRef();
  return (
    <ScrollView>
      <Image
        source={require("../../../assets/img/login_logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <View style={styles.viewContainer}>
        <LoginForm toastRef={toastRef} />
        <CreateAccount />
      </View>
      <Divider style={styles.divider} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
}

function CreateAccount() {
  const navigation = useNavigation();
  return (
    <Text style={styles.textRegister}>
      ¿Aún no tiene una cuenta?{" "}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate("register")}
      >
        Regístrate
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40,
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 5,
  },
  btnRegister: {
    color: "#FB7508",
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#FB7508",
    margin: 40,
  },
});
