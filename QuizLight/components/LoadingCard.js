import * as React from 'react';
import {View} from 'react-native';

import {style} from '../styles';
import {LoadingLogoContainer} from '.';

export const LoadingCard = props => {
  return (
    <>
      <View style={[style.loadingCard, style.loadingCardBackground]} />
      <View style={[style.loadingCard]}>
        <LoadingLogoContainer />
      </View>
    </>
  );
};
