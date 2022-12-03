import { NativeModules } from 'react-native';

const { ImageLabelingModule } = NativeModules;


export const lableImage = (url: string ) => {
    return ImageLabelingModule.lableImage(url);
};