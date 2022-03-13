import * as React from 'react';
import {Text, View} from 'react-native';

import {style} from '../../styles';

export const QuizHeader = props => {
  return (
    props.card !== null && (
      <View>
        <Text style={style.quizCounter}>
          •{' '}
          <Text style={[style.quizCounter, style.quizCounterNumber]}>
            {props.total}
          </Text>
        </Text>
      </View>
    )
  );
};
