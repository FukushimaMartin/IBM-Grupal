import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, StatusBar, Animated } from 'react-native';
import { LogBox } from "react-native";
import { firebase } from "./app/utils/firebase";

import Cloud from "./assets/img/cloud.png";
import Sun from "./assets/img/sun.png";
import Navigation from './app/navigation/Navigation';


LogBox.ignoreAllLogs();

export default function App() {
  const [animated, setAnimated] = useState(false)
  const [show] = useState(new Animated.Value(0))
  const [position] = useState(new Animated.Value(700))
  const [font] = useState(new Animated.Value(1))

  useEffect( () => {
    Animated.parallel([
      
      Animated.timing(show, {
        toValue: 1,
        duration: 2500,
        delay: 3000,
        useNativeDriver: false,
      }),
      Animated.timing(position, {
        toValue: -700,
        duration: 5000,
        useNativeDriver: false,
      })

    ]).start( () => {

      Animated.timing(font, {
        toValue: 275,
        duration: 1000,
        useNativeDriver: false,

      }).start( () => setAnimated(true) );
    });
  }, [])

  if (!animated)
  return (
    <>
      <StatusBar 
        translucent 
        backgroundColor="rgba(0,0,0,0.2)"
      />
      <View style={styles.container}>
        <Animated.Image 
          style={ [styles.imageBackground, {opacity: show, top: font}] } 
          source={Sun}
        />
        <Animated.Image
            style={[styles.image, { top: position }]}
            source={Cloud}
          />
        <Animated.Text 
          style={ [styles.text, {opacity: show, transform:[{scale: font}]}] } >
          ClimApp
        </Animated.Text>
      </View>
    </>
  );

  return(
    <Navigation />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FB7508',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 500,
    height: 500,
    resizeMode: "contain",
    marginRight: 10,
  },
  imageBackground: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginTop: 60,
  },
  text: {
    fontWeight: "bold",
    fontSize: 50,
    color: "white",
    fontFamily: "serif",
    paddingVertical: 100,
  },
});