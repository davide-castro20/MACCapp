import { NativeModules } from 'react-native';

const { LocationModule } = NativeModules;


export const getLocationName = (latitude: number, longitude: number): Promise<Response> => {
    return LocationModule.convertToLocation(latitude, longitude);
};
