import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {View} from 'react-native';

import {FooterButton, LoadingLogoContainer} from '../../components';
import {style} from '../../styles';

export const QuizSelectorView = props => {
  const quizzesToPick = [];
  let currentValue = null;

  for (const quizDescr of props.quizDescrs) {
    const newElement = (
      <Picker.Item
        key={quizDescr.quizId}
        label={quizDescr.quizName}
        value={quizDescr.quizId}
      />
    );

    quizzesToPick.push(newElement);

    if (newElement.value === props.currentQuizDescr.quizId) {
      currentValue = newElement.value;
    }
  }

  const [selectedQuiz, setSelectedQuiz] = useState(currentValue);

  return (
    <View style={(style.basicContainer, style.quizSelectorContainer)}>
      {props.isLoading && (
        <View style={style.loadingContainer}>
          <LoadingLogoContainer />
        </View>
      )}

      <Picker
        enabled={!props.isLoading}
        prompt="Which quiz do you want to practice?"
        mode="dialog"
        style={style.quizSelectorMenu}
        selectedValue={selectedQuiz}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedQuiz(itemValue);
          props.onPickerChanged(itemValue);
        }}>
        {quizzesToPick}
      </Picker>

      <FooterButton
        disabled={props.isLoading}
        title="Save"
        onPress={props.onSaveButtonPress}
        style={style.litButton}
      />
    </View>
  );
};
