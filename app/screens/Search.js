import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM cities WHERE name LIKE '${search}%'`)
        .then((response) => {
          setCities(response);
        });
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        lightTheme={true}
        placeholder="Buscar ciudad..."
        onChangeText={(event) => setSearch(event)}
        containerStyle={styles.searchBar}
        value={search}
      />
      {cities.length === 0 ? (
        <NotFoundCities />
      ) : (
        <FlatList
          data={cities}
          renderItem={(city) => <City city={city} navigation={navigation} />}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function NotFoundCities() {
  return (
    <View style={styles.viewNoFound}>
      <Image
        source={require("../../assets/img/no_result_found.png")}
        resizeMode="cover"
        style={styles.imageNoFound}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        No hay resultados de la búsqueda
      </Text>
    </View>
  );
}

function City(props) {
  const { city, navigation } = props;
  const { id, name, image } = city.item;

  return (
    <ListItem
      title={name}
      // image
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("cities", { screen: "city", params: { id, name } })
      }
    />
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
    margin: 20,
  },
  viewNoFound: {
    flex: 1,
    alignItems: "center",
  },
  imageNoFound: {
    width: 200,
    height: 200,
  },
});
