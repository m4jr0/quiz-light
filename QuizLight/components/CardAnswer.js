import * as React from 'react';
import {Text} from 'react-native';

import {style} from '../styles';
import {TaggifiedListText} from '.';

export const CardAnswer = props => {
  return (
    <>
      <Text style={[style.label, style.cardLabel]}>Answer</Text>
      <TaggifiedListText style={style.cardAnswer}>
        {props.answer}
      </TaggifiedListText>
    </>
  );
};
