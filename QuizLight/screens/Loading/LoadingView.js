import React from 'react';
import {View} from 'react-native';

import {style} from '../../styles';
import {LoadingLogoContainer} from '../../components';

export const LoadingView = props => {
  return (
    <View style={style.loadingContainer}>
      <LoadingLogoContainer />
    </View>
  );
};
