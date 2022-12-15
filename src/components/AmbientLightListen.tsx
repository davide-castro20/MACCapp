import React, { useState, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon, Switch, useThemeMode, ThemeMode } from '@rneui/themed'


import { startLightSensor, stopLightSensor } from '../ambientlight/index';




const LOW_LIGHT_THRESHOLD = 200;
const HIGH_LIGHT_THRESHOLD = 1000;

const AmbientLightListen = (props: any) => {
    
    const { mode, setMode } = useThemeMode();

    const [themeMode, setThemeMode] = useState("dark");
    

    useEffect(() => {
        startLightSensor();
        
        const subscription = DeviceEventEmitter.addListener(
          'LightSensor',
          (data: { lightValue: number }) => {
              
              if (themeMode == "dark" && data.lightValue >= HIGH_LIGHT_THRESHOLD) {
                console.log("switch to light");
                setMode("light");
                setThemeMode("light");
    
              } else if (themeMode == "light" && data.lightValue <= LOW_LIGHT_THRESHOLD) {
                console.log("switch to dark");
                setMode("dark");
                setThemeMode("dark");
              }
          },
        );
    
        console.log(subscription)
    
        return () => {
            stopLightSensor();
            subscription?.remove();
        };
      }, [themeMode]);

      return (<></>);
};

export default AmbientLightListen;