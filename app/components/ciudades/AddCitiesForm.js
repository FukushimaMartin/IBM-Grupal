import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Text,
  Image,
} from "react-native";
import { Icon, Input, Button } from "react-native-elements";
import { map } from "lodash";
import * as Location from "expo-location";
import Toast from "react-native-easy-toast";
import MapView from "react-native-maps";
import Modal from "../Modal";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddCitiesForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [cityName, setCityName] = useState("");
  const [cityAddress, setCityAddress] = useState("");
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationCity, setLocationCity] = useState(null);
  const [cityRegion, setCityRegion] = useState("");

  const addCity = () => {
    if (!cityName && !cityAddress) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!locationCity) {
      toastRef.current.show("Tienes que ubicar tu lugar favorito en el mapa");
    } else {
      setIsLoading(true);
      db.collection("cities")
        .add({
          name: cityName,
          address: cityAddress,
          //region: cityRegion,
          location: locationCity,
          createAt: new Date(),
          createBy: firebase.auth().currentUser.uid,
        })
        .then(() => {
          setIsLoading(false);
          navigation.navigate("cities");
        })
        .catch(() => {
          setIsLoading(false);
          toastRef.current.show("Error al guardar la ciudad");
        });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <FormAdd
        setCityName={setCityName}
        setCityAddress={setCityAddress}
        setIsVisibleMap={setIsVisibleMap}
        locationCity={locationCity}
        cityAddress={cityAddress}
        cityName={cityName}
      />
      <Button
        title="Crear Ciudad"
        onPress={addCity}
        buttonStyle={styles.btnAddCity}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationCity={setLocationCity}
        toastRef={toastRef}
        setCityAddress={setCityAddress}
        setCityName={setCityName}
        setCityRegion={setCityRegion}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
}

function FormAdd(props) {
  const {
    setCityName,
    setCityAddress,
    setIsVisibleMap,
    locationCity,
    cityName,
    cityAddress,
  } = props;
  return (
    <View style={styles.viewForm}>
      <Image
        source={require("../../../assets/img/anadecity_screen.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Input
        placeholder="Nombre de la ciudad"
        containerStyle={styles.input}
        onChange={(event) => setCityName(event.nativeEvent.text)}
        value={cityName}
      />
      <Input
        placeholder="Domicilio"
        containerStyle={styles.input}
        onChange={(event) => setCityAddress(event.nativeEvent.text)}
        value={cityAddress}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationCity ? "#FB7508" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      />
    </View>
  );
}

function Map(props) {
  const {
    isVisibleMap,
    setIsVisibleMap,
    toastRef,
    setLocationCity,
    setCityAddress,
    setCityName,
    setCityRegion,
  } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toastRef.current.show("Permission to access location was denied", 3000);
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const confirmLocation = () => {
    setLocationCity(location);
    toastRef.current.show("Ubicación guardada correctamente");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar ubicación"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar ubicación"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 200,
    marginTop: 25,
    marginVertical: 20,
  },
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnAddCity: {
    backgroundColor: "#FB7508",
    margin: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
  },
});
