import React, {useState} from 'react';
import {Text, TouchableHighlight} from 'react-native';

import {style} from '../styles';

export const PopCheckbox = props => {
  const [checked, setChecked] = useState(props.checked);

  return (
    <TouchableHighlight
      onPress={event => {
        setChecked(!checked);
        props.onPress(event, !checked);
      }}
      style={
        !checked
          ? [style.popCheckbox, props.style]
          : [
              style.popCheckbox,
              style.style,
              style.popCheckboxChecked,
              style.checkedstyle,
            ]
      }>
      <Text
        style={
          !checked
            ? [style.popCheckboxLabel, props.labelStyle]
            : [
                style.popCheckboxLabel,
                props.labelStyle,
                style.popCheckboxLabelChecked,
                props.labelCheckedStyle,
              ]
        }>
        {props.label}
      </Text>
    </TouchableHighlight>
  );
};
