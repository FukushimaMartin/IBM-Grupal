import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import * as firebase from "firebase";
import "firebase/firestore";

import { firebaseApp } from "../../utils/firebase";
import ListCities from "../../components/ciudades/ListCities";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [totalCities, setTotalCities] = useState(0);
  const limitCities = 10;
  const [startCities, setStartCities] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //En este componente podremos ver el listado de ciudades, con la posibilidad de acceder a cada una

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("cities")
        .get()
        .then((snap) => {
          setTotalCities(snap.size);
        });

      const resultCities = [];

      db.collection("cities") //ingresamos a la tabla cities de nuestra db
        .orderBy("createAt", "desc") //ordenamos segun criterio
        .limit(limitCities) //limitamos una cantidad de resultados a obtener
        .get()
        .then((response) => {
          //aqui obtenemos cada ciudad encontrada segun las preferencias arriba mencionadas
          setStartCities(response.docs[response.docs.length - 1]);
          response.forEach((doc) => {
            const city = doc.data();
            city.id = doc.id;
            resultCities.push(city); //la agregamo a nuestro array de ciudades
          });
          setCities(resultCities); //guardamos la lista completa de ciudades
        });
    }, [])
  );

  const handleLoadMore = () => {
    //este metodo permite traer mas ciudades, en caso de que las haya
    const resultCities = [];

    cities.length < totalCities && setIsLoading(true);

    db.collection("cities")
      .orderBy("createAt", "desc")
      .startAfter(startCities.data().createAt)
      .limit(limitCities)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartCities(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const city = doc.data();
          city.id = doc.id;

          resultCities.push(city);
        });

        setCities([...cities, ...resultCities]);
        //las adiciona a nuestro listado, sin eliminar las anteriores
      });
  };

  return (
    <View styles={styles.viewBody}>
      <ListCities
        cities={cities}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />

      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#FB7508"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-cities")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    top: 430,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
