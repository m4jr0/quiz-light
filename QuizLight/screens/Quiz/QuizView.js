import React, {useEffect} from 'react';
import {ToastAndroid, View} from 'react-native';

import {Card, FooterButton, LoadingCard} from '../../components';
import {Grade} from '../../core';
import {style} from '../../styles';
import {QuizHeader} from './QuizHeader';

export const QuizView = props => {
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <QuizHeader total={props.count} />,
    });
  }, [props]);

  if (props.message) {
    ToastAndroid.showWithGravity(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    );
  }

  return (
    props.card !== null && (
      <View style={style.quizContainer}>
        <Card
          id={props.card.id}
          grade={props.card.grade}
          question={props.card.question}
          answer={props.card.answer}
          notes={props.card.notes}
          isRevealed={props.isRevealed}
          onMissButtonPress={props.onMissButtonPress}
          onLevelUpButtonPress={props.onLevelUpButtonPress}
          disabled={props.isRevealed || props.isLoading}
          cardButtonMissDisabled={props.card.grade === Grade.Miss.name}
          cardButtonLevelUpDisabled={props.card.grade === Grade.God.name}
        />

        <FooterButton
          title={props.card.footerButtonTitle}
          onPress={props.onNextButtonPress}
          disabled={props.isLoading}
        />

        {props.isLoading && <LoadingCard />}
      </View>
    )
  );
};
