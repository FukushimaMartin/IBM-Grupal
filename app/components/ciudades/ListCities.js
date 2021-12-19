import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListCities(props) {
  const { cities, handleLoadMore, isLoading } = props;
  const navigation = useNavigation();
  //Se muestra el listado de ciudades recibidas por parametro
  //Cada una invoca a la funcion City con sus datos particulares

  return (
    <View>
      {size(cities) > 0 ? (
        <FlatList
          data={cities}
          renderItem={(city) => <City city={city} navigation={navigation} />}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderCities}>
          <ActivityIndicator size="large" />
          <Text>Cargando ciudades</Text>
        </View>
      )}
    </View>
  );
}

function City(props) {
  const { city, navigation } = props;
  const { id, name, address } = city.item;

  /*Esta funcion recibe una ciudad por parametro, permite mostrarla por pantalla y al clickear en ella
    dirige al usuario al componente de la ciudad, para mostrar sus datos, ubicacion y clima*/

  const goCity = () => {
    navigation.navigate("city", {
      id: id,
      name: name,
    });
  };

  return (
    <TouchableOpacity onPress={goCity}>
      <View style={styles.viewCity}>
        <Image
          source={require("../../../assets/img/login_logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <View>
          <Text style={styles.cityName}>{name}</Text>
          <Text style={styles.cityAddress}>{address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  //Esta funcion permite mostrar mas ciudades cuando el usuario se desplaza hacia abajo, hasta que no queden mas
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderCities}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundCities}>
        <Text>No quedan ciudades por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  loaderCities: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  viewCity: {
    flexDirection: "row",
    margin: 10,
  },
  cityName: {
    fontWeight: "bold",
    fontSize: 20,
  },
  cityAddress: {
    paddingTop: 2,
    color: "grey",
  },
  notFoundCities: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
