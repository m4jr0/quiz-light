import * as React from 'react';
import {Text} from 'react-native';

import {style} from '../styles';
import {TaggifiedListText} from '.';

export const CardQuestion = props => {
  return (
    <>
      <Text style={[style.label, style.cardLabel]}>Question</Text>
      <TaggifiedListText style={style.cardQuestion}>
        {props.question}
      </TaggifiedListText>
    </>
  );
};
