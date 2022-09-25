import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import {style} from '../styles';

export const FabButton = props => {
  return (
    <TouchableOpacity
      style={
        !props.disabled
          ? [style.fabButton, props.style]
          : [
              style.fabButton,
              props.style,
              style.fabButtonDisabled,
              props.styleDisabled,
            ]
      }
      onPress={props.onPress}
      disabled={props.disabled}>
      <Text
        style={
          !props.disabled
            ? [style.fabButtonTitle, props.textStyle]
            : [
                style.fabButtonTitle,
                props.textStyle,
                style.fabButtonTitleDisabled,
                props.textStyleDisabled,
              ]
        }>
        {!props.disabled
          ? props.title
          : props.titleDisabled
          ? props.titleDisabled
          : props.title}
      </Text>
    </TouchableOpacity>
  );
};
