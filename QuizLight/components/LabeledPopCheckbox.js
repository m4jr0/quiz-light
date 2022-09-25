import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';

import {style} from '../styles';

export const LabeledPopCheckbox = props => {
  let outsideStyle;

  if (!props.checked) {
    outsideStyle = [style.labeledPopCheckbox, props.style];

    if (props.disabled === true) {
      outsideStyle.push(style.labeledPopCheckboxDisabled);
    }
  } else {
    outsideStyle = [style.labeledPopCheckbox, style.style];

    if (props.disabled === true) {
      outsideStyle.push(style.labeledPopCheckboxDisabled);
    }

    outsideStyle.push(style.labeledPopCheckboxChecked);
    outsideStyle.push(style.checkedStyle);

    if (props.disabled === true) {
      outsideStyle.push(style.labeledPopCheckboxCheckedDisabled);
    }

    if (props.disabled === true) {
      outsideStyle.push(style.labeledPopCheckboxInsideDisabled);
    }
  }

  let insideStyle;

  if (!props.checked) {
    insideStyle = [style.labeledPopCheckboxInside, props.insideStyle];

    if (props.disabled === true) {
      insideStyle.push(style.labeledPopCheckboxInsideDisabled);
    }
  } else {
    insideStyle = [style.labeledPopCheckboxInside, style.insideStyle];

    if (props.disabled === true) {
      insideStyle.push(style.labeledPopCheckboxInsideDisabled);
    }

    insideStyle.push(style.labeledPopCheckboxInsideChecked);
    insideStyle.push(style.insideCheckedStyle);

    if (props.disabled === true) {
      insideStyle.push(style.labeledPopCheckboxInsideCheckedDisabled);
    }
  }

  return (
    <View style={[style.labeledPopCheckboxContainer, props.containerStyle]}>
      <TouchableHighlight
        onPress={event => {
          if (props.disabled === true) {
            return;
          }

          props.onValueChange(!props.checked);
        }}
        style={outsideStyle}>
        <View style={insideStyle} />
      </TouchableHighlight>
      <Text style={[style.labeledPopCheckboxLabel, props.labelStyle]}>
        {props.label}
      </Text>
    </View>
  );
};
