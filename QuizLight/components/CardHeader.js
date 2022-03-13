import * as React from 'react';
import {Text} from 'react-native';

import {style} from '../styles';

export const CardHeader = props => {
  return (
    <>
      <Text style={style.cardHeader}>
        #<Text style={style.cardId}>{props.id}</Text> [
        <Text style={style.cardGrade}>{props.grade}</Text>]
      </Text>
    </>
  );
};
