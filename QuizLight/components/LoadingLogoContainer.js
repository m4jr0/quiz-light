import React, {useState} from 'react';
import {Animated, Image, View} from 'react-native';

import {style} from '../styles';

export const LoadingLogoContainer = props => {
  const duration = 1500;
  const initialLogoScale = 0.9;
  const initialCircleScale = 0.7;
  const endLogoScale = 1;
  const endCircleScale = 1.5;
  const [rotation] = useState(new Animated.Value(0));
  const [logoScale] = useState(new Animated.Value(initialLogoScale));
  const [loadingCircleScale] = useState(new Animated.Value(initialCircleScale));

  Animated.loop(
    Animated.timing(rotation, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }),
  ).start();

  Animated.loop(
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: endLogoScale,
        duration: duration * 1.5,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: initialLogoScale,
        duration: duration * 1.5,
        useNativeDriver: true,
      }),
    ]),
  ).start();

  Animated.loop(
    Animated.sequence([
      Animated.timing(loadingCircleScale, {
        toValue: endCircleScale,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(loadingCircleScale, {
        toValue: initialLogoScale,
        duration: duration,
        useNativeDriver: true,
      }),
    ]),
  ).start();

  return (
    <>
      <Animated.View
        style={[
          style.loadingLogoContainer,
          {
            transform: [
              {
                scale: logoScale,
              },
            ],
          },
        ]}>
        <Image
          source={{uri: 'asset:/app_icon.png'}}
          style={style.loadingLogo}
        />
      </Animated.View>
      <Animated.View
        style={{
          transform: [
            {
              rotate: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['90deg', '450deg'],
              }),
            },
          ],
        }}>
        <View style={style.loadingCircleContainer}>
          <Animated.View
            style={[
              style.loadingCircle,
              {
                transform: [
                  {
                    scale: loadingCircleScale,
                  },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>
    </>
  );
};
