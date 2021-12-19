import React from 'react'
import MapView from 'react-native-maps';
import openMap from "react-native-open-maps";

export default function Map(props) {
    const {location, name, height} = props

    //Este componente permite abrir una venta con el mapa de google
    //centrara el mismo según la localización recibida por parametros

    const openAppMap = () => {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 16,
            query: name
        })
    }
    return (
        <MapView
            style={{height: height, width: "100%"}}
            initialRegion={location}
            onPress={openAppMap}
        >
            <MapView.Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}
