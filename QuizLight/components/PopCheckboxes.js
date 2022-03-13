import * as React from 'react';
import {View} from 'react-native';

import {style} from '../styles';
import {PopCheckbox} from '.';

function generatePopCheckoxes(descrs) {
  if (!descrs) {
    return null;
  }

  const checkboxes = [];

  for (const item of descrs) {
    checkboxes.push(
      <PopCheckbox
        checked={item.checked}
        id={item.id}
        key={`popCheckbox${item.id}`}
        label={item.label}
        labelStyle={item.labelStyle}
        onPress={item.onPress}
        style={item.style}
      />,
    );
  }

  return checkboxes;
}

export const PopCheckboxes = props => {
  return (
    <>
      <View style={[style.popCheckboxes, style.style]}>
        {generatePopCheckoxes(props.checkboxDescrs)}
      </View>
    </>
  );
};
