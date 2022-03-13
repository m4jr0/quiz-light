import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import {style} from '../styles';

export const FooterButton = props => {
  return (
    <TouchableOpacity
      style={
        !props.disabled
          ? [style.footerButton, props.style]
          : [
              style.footerButton,
              props.style,
              style.footerButtonDisabled,
              props.styleDisabled,
            ]
      }
      onPress={props.onPress}
      disabled={props.disabled}>
      <Text
        style={
          !props.disabled
            ? [style.footerButtonTitle, props.textStyle]
            : [
                style.footerButtonTitle,
                props.textStyle,
                style.footerButtonTitleDisabled,
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
