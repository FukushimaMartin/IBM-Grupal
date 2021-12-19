import React, {useRef, useState} from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import AddCitiesForm from "../../components/ciudades/AddCitiesForm";

export default function AddCities(props){
    const {navigation} = props
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef()

    //Este componente muestra el componente AddCitiesForm para agregar una ciudad nueva

    return(
        <View>
            <AddCitiesForm
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Creando ciudad" />
        </View>
    )
}
