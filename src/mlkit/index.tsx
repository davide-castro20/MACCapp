import { NativeModules } from 'react-native';

const { ImageLabelingModule } = NativeModules;


export const labelImage = (url: string ) => {
    return ImageLabelingModule.labelImage(url);
};