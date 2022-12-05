import { NativeModules } from 'react-native';

const { ImageLabelingModule, FaceDetectionModule } = NativeModules;


export const labelImage = (url: string) => {
    return ImageLabelingModule.labelImage(url);
};

export const detectFaces = (url: string) => {
    return FaceDetectionModule.detectFaces(url);
};