import * as React from 'react';
import {Text} from 'react-native';

import {style} from '../styles';
import {TaggifiedListText} from '.';

export const CardNotes = props => {
  return (
    <>
      <Text style={[style.label, style.cardLabel]}>Notes</Text>
      <TaggifiedListText style={style.cardNotes}>
        {props.notes}
      </TaggifiedListText>
    </>
  );
};
