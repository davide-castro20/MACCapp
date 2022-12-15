import { NativeModules } from 'react-native';

const { AmbientLightModule } = NativeModules;


export const startLightSensor = () => {
    return AmbientLightModule.startLightSensor();
};

export const stopLightSensor = () => {
    return AmbientLightModule.stopLightSensor();
};

