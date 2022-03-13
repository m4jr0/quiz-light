import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';

import {style} from '../styles';

export const LabeledPopCheckbox = props => {
  return (
    <View style={[style.labeledPopCheckboxContainer, props.containerStyle]}>
      <TouchableHighlight
        onPress={event => {
          props.onValueChange(!props.checked);
        }}
        style={
          !props.checked
            ? [style.labeledPopCheckbox, props.style]
            : [
                style.labeledPopCheckbox,
                style.style,
                style.labeledPopCheckboxChecked,
                style.checkedStyle,
              ]
        }>
        <View
          style={
            !props.checked
              ? [style.labeledPopCheckboxInside, props.insideStyle]
              : [
                  style.labeledPopCheckboxInside,
                  style.insideStyle,
                  style.labeledPopCheckboxInsideChecked,
                  style.insideCheckedStyle,
                ]
          }
        />
      </TouchableHighlight>
      <Text style={[style.labeledPopCheckboxLabel, props.labelStyle]}>
        {props.label}
      </Text>
    </View>
  );
};
