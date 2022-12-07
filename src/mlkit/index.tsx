import { NativeModules } from 'react-native';

const { ImageLabelingModule, FaceDetectionModule } = NativeModules;

export type FaceObject = {
    id: number,
    top: number,
    left: number,
    centerX: number,
    centeY: number,
    width: number,
    height: number
};

export const labelImage = (url: string) => {
    return ImageLabelingModule.labelImage(url);
};

export const detectFaces = (url: string): Promise<Response> => {
    return FaceDetectionModule.detectFaces(url);
};