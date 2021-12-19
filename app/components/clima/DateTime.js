import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saterday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Oct",
  "Nov",
  "Dec",
];

const WeatherItem = ({ title, value, unit }) => {
  return (
    <View>
        <Text style={styles.weatherTitle}> {title} </Text>
        <Text style={styles.weatherValue}> {value} {unit} </Text>
    </View>
  );
};

export default function DateTime({ temperatura, humedad, idIcon }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const icon = `http://openweathermap.org/img/wn/${idIcon}@2x.png`;
  
  /*Este componente organiza y muestra por pantalla el clima de la ciudad seleccionada*/

  useEffect(() => {
    setInterval(() => {
      const time = new Date();
      const hour = time.getHours();
      const minutes = time.getMinutes();

      setTime(
        (hour < 10 ? "0" + hour : hour) +
          ":" +
        (minutes < 10 ? "0" + minutes : minutes)
      );

      const date = time.getDate();
      const day = time.getDay();
      const month = time.getMonth();

      setDate(days[day] + " , " + date + " " + months[month]);
    }, 1000);
  }, []);

  return (
    <View style={styles.containerDataTime}>

        <View style={styles.weatherContainer}>
          <View style={styles.containerIcon}>
            <Image
                source={{uri: icon}}
                resizeMode="contain"
                style={styles.imageIcon}
            />
          </View>

          <View style={styles.containerWeatherItem}>
            <WeatherItem
              title="Temperatua "
              value={temperatura ? temperatura : ""}
              unit="°C"
            />
            <WeatherItem 
              title="Humedad "
              value={humedad}
              unit="%"
            />
          </View>
        </View>

      
        
      <View style={styles.containerHora}>
          <Text style={styles.hora}>{time}</Text>
          <Text style={styles.date}>{date}</Text>
      </View>

  
    </View>
  );
}

const styles = StyleSheet.create({
  containerDataTime: {
    marginTop: 5,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignContent:"center"
  },
  containerHora:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hora: {
    fontSize: 15,
    color: "black",
    marginLeft: 5,
  },
  date: {
    fontSize: 15,
    color: "black",
    marginRight: 5,
  },

  weatherContainer: {
    backgroundColor: "#82d0f5",
    borderRadius: 10,
    flexDirection: "row",
    alignContent: "center",
  },


  containerIcon:{
    alignItems: "center",
    justifyContent: "center"
  },
  imageIcon: {
    width: 100,
    height: 100,
  },

  containerWeatherItem:{
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  weatherValue: {
    fontSize: 27,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
