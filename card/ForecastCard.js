import React from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground} from 'react-native';

const ForecastCard = () => {
    return (
        <View style= {styles.cardContainer} >
            <ImageBackground
            style={{height: "100%", width: "100%", opacity: 0.8, flex: 1}}
            imageStyle={{ borderRadius: 8}}
            source={require('../assets/img/sunshine.jpg')} >
            <Text> Acá iria el clima </Text> 
            </ImageBackground>
        </View> 
    );
};


const deviceWidth = Dimensions.get('window').width;
const radius = 20;
const styles = StyleSheet.create({
    cardContainer: {
        width: deviceWidth -25,
        backgroundColor: '#c0e5ed',
        height: 200,
        borderRadius: radius,
        shadowColor: '#000',
        shadowOpacity: 0.75,
        shadowRadius: 5,
        elevation: 20,
        
    },

});

export default ForecastCard;