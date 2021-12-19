import React from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";

export default function About() {
  return (
    <ScrollView>
      <Image
        source={require("../../assets/img/fondo1.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <Image
        source={require("../../assets/img/fondo2.png")}
        resizeMode="contain"
        style={styles.image}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 600,
    marginTop: 10,
  },
});
