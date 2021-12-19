import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon, Image, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

import Loading from "../components/Loading";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [cities, setCities] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  // navigation.setOptions({ headerLeft: () => {(
  //     <Icon
  //         type="material-community"
  //         name= "chevron-left"
  //         onPress={() => navigation.goBack()}
  //         color= {"#f00"}
  //         size={30}
  //         underlayColor="transparent"
  //     />
  // )} })

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idCitiesArray = [];
            response.forEach((doc) => {
              idCitiesArray.push(doc.data().idCity);
            });
            getDataCity(idCitiesArray).then((response) => {
              const cities = [];
              response.forEach((doc) => {
                const city = doc.data();
                city.id = doc.id;
                cities.push(city);
              });
              setCities(cities);
            });
          });
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );

  const getDataCity = (idCitiesArray) => {
    const arrayCities = [];
    idCitiesArray.forEach((idCity) => {
      const result = db.collection("cities").doc(idCity).get();
      arrayCities.push(result);
    });
    return Promise.all(arrayCities);
  };

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (cities?.length === 0) {
    return <NotFoundCities />;
  }

  return (
    <View style={styles.viewBody}>
      {cities ? (
        <FlatList
          data={cities}
          renderItem={(city) => (
            <City
              city={city}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderCities}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Cargando ciudades
          </Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando ciudad de favoritos" isVisible={isLoading} />
    </View>
  );
}

function NotFoundCities() {
  return (
    <View style={styles.viewImage}>
      <Image
        source={require("../../assets/img/alert_cities.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        No tienes ciudades favoritas
      </Text>
    </View>
  );
}

function UserNoLogged(props) {
  const { navigation } = props;

  return (
    <View style={styles.viewImage}>
      <Image
        source={require("../../assets/img/alert_login.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <Text style={styles.textNoLogged}>
        Debes loguearte para ver tus favoritos
      </Text>
      <Button
        title="Ir al login"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnStyle}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function City(props) {
  const { city, setIsLoading, toastRef, setReloadData, navigation } = props;
  const { id, name } = city.item;

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar ciudad de favoritos",
      "¿Estás seguro de que quieres hacer esto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsLoading(true);

    db.collection("favorites")
      .where("idCity", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;

          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              toastRef.current.show("Ciudad eliminada de favoritos");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show("Error al eliminar la ciudad de favoritos");
            });
        });
      });
  };

  return (
    <View style={styles.city}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("cities", {
            screen: "city",
            params: { id: id, name: name },
          })
        }
      >
        <View style={styles.viewLogo}>
          <Image
            resizeMode="cover"
            source={require("../../assets/img/clima-playa.jpg")}
            style={styles.logo}
            PlaceholderContent={<ActivityIndicator color="#fff" />}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#ff0025"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
    marginTop: 20,
  },
  viewImage: {
    marginTop: 50,
  },
  textNoLogged: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  btnContainer: {
    marginTop: 20,
    width: "80%",
    marginLeft: 40,
  },
  btnStyle: {
    backgroundColor: "#FB7508",
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderCities: {
    marginTop: 10,
    marginBottom: 10,
  },
  city: {
    margin: 10,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -5,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
