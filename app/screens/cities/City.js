import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { map } from "lodash";
import { ListItem, Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

import Loading from "../../components/Loading";
import { ScrollView } from "react-native-gesture-handler";
import Map from "../../components/Map";
import Clima from "../../components/clima/Clima";

const db = firebase.firestore(firebaseApp);

export default function City(props) {
  const { navigation, route } = props;
  const { id, name } = route.params;
  const [city, setCity] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  navigation.setOptions({ title: name });

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    //trae la ciudad de nuestra db
    db.collection("cities")
      .doc(id)
      .get()
      .then((response) => {
        const data = response.data();

        data.id = response.id;
        setCity(data);
      });
  }, []);

  useEffect(() => {
    if (userLogged && city) {
      db.collection("favorites")
        .where("idCity", "==", city.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, [userLogged, city]);

  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Debe loguearse antes de agregar una ciudad a favoritos"
      );
    } else {
      //permite agregar una ciudad a la tabla de favoritos
      //relaciona usuario con la ciudad
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idCity: city.id,
      };
      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("Ciudad añadida a favoritos");
        })
        .catch(() => {
          toastRef.current.show("Error al añadir la ciudad a favoritos");
        });
    }
  };

  const removeFavorite = () => {
    //este metodo permite eliminar una ciudad de favoritos, no la elimina de la lista general
    db.collection("favorites")
      .where("idCity", "==", city.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;

          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show(
                "Se ha eliminado la ciudad de la lista de favoritos"
              );
            })
            .catch(() => {
              toastRef.current.show(
                "Error al eliminar la ciudad de la lista de favoritos"
              );
            });
        });
      });
  };

  const removeCity = () => {
    //este metodo eliminar una ciudad de la lista de ciudades
    db.collection("cities")
      .doc(id)
      .get()
      .then((response) => {
        const idCity = response.id;

        db.collection("cities")
          .doc(idCity)
          .delete()
          .then(() => {
            db.collection("favorites")
              .where("idCity", "==", idCity)
              .get()
              .then((response) => {
                response.forEach((doc) => {
                  const idFavorite = doc.id;

                  db.collection("favorites")
                    .doc(idFavorite)
                    .delete()
                    .then(() => {
                      setIsFavorite(false);
                    })
                    .catch(() => {
                      toastRef.current.show(
                        "Error al eliminar la ciudad de la lista de favoritos"
                      );
                    });
                });
              });

            toastRef.current.show(
              "Se ha eliminado la ciudad de la lista de ciudades"
            );
            navigation.navigate("cities");
          })
          .catch(() => {
            toastRef.current.show(
              "Error al eliminar la ciudad de la lista de ciudades"
            );
          });
      });
  };

  if (!city) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewDelete}>
        <Icon
          type="material-community"
          name={"trash-can-outline"}
          onPress={removeCity}
          color={"#f00"}
          size={30}
          underlayColor="transparent"
        />
      </View>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={"#00b347"}
          size={30}
          underlayColor="transparent"
        />
      </View>
      <TitleCity name={city.name} />

      <Clima lat={city.location.latitude} lon={city.location.longitude} />

      <CityInfo
        location={city.location}
        name={city.name}
        address={city.address}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
}

function TitleCity(props) {
  const { name } = props;

  return (
    <View style={styles.viewCityTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameCity}> {name} </Text>
      </View>
    </View>
  );
}

function CityInfo(props) {
  const { location, name, address } = props;
  const listInfo = [
    {
      text: address,
      iconName: "map-marker-radius",
      iconType: "material-community",
      action: null,
    },
    {
      text: name,
      iconName: "city-variant-outline",
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.viewCityInfo}>
      {map(listInfo, (item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#FB7508",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}

      <Map location={location} name={name} height={150} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewCityTitle: {
    padding: 15,
    alignItems: "center",
  },
  nameCity: {
    fontSize: 30,
    fontWeight: "bold",
  },
  viewCityInfo: {
    margin: 15,
    marginTop: 5,
  },
  cityInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderTopColor: "#d8d8d8",
    borderTopWidth: 1,
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingRight: 15,
  },
  viewDelete: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
  btnGoBack: {
    backgroundColor: "#1190CB",
    marginRight: 100,
    marginLeft: 100,
    marginTop: 20,
    fontWeight: "bold",
  },
});
