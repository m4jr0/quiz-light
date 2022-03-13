import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {CommonActions} from '@react-navigation/native';

import {QuizView} from './QuizView';
import {QuestionsHandler} from '../../core/questions_handler';
import {Grade} from '../../core';

export const QuizContainer = ({navigation, route}) => {
  const gradeIds = route.params.gradeIds;
  const isReversed = route.params.isReversed;
  const [isRevealed, setIsRevealed] = useState(false);
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState(null);
  const isMessageDisplayed = useRef(false);
  let filter = useMemo(() => [], []);

  const goToWelcomeScreen = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'Welcome',
            params: {
              welcomeMessage: 'Well done, lad.',
            },
          },
        ],
      }),
    );
  }, [navigation]);

  const setNextCard = useCallback(() => {
    QuestionsHandler.getInstance()
      .getRandomQuestion(gradeIds, filter)
      .then(newCard => {
        if (!newCard) {
          goToWelcomeScreen();
          return;
        }

        filter.push(newCard.id);

        if (isReversed) {
          const question = newCard.question;
          newCard.question = newCard.answer;
          newCard.answer = question;
        }

        newCard.footerButtonTitle = 'Reveal';
        setIsRevealed(false);
        setCount(c => c - 1);
        setCard(newCard);
      });
  }, [gradeIds, isReversed, filter, goToWelcomeScreen]);

  const updateGrade = grade => {
    setIsLoading(true);
    QuestionsHandler.getInstance()
      .updateQuestion(card.id, grade)
      .then(response => {
        setIsLoading(false);

        if (!response.isUpdated) {
          setMessage(response.message);
          return;
        }

        setNextCard();
      });
  };

  useEffect(() => {
    QuestionsHandler.getInstance()
      .getQuestionCount(gradeIds)
      .then(itemCount => {
        setCount(itemCount + 1);
        setNextCard();
      });
  }, [gradeIds, setNextCard]);

  if (message) {
    if (!isMessageDisplayed.current) {
      isMessageDisplayed.current = true;
    } else {
      isMessageDisplayed.current = false;
      setMessage(null);
    }
  }

  return React.createElement(QuizView, {
    card: card,
    count: count,
    isRevealed: isRevealed,
    navigation: navigation,
    isLoading: isLoading,
    message: message,
    onNextButtonPress: async event => {
      event.preventDefault();

      if (!isRevealed) {
        card.footerButtonTitle = count > 0 ? 'Next' : 'Finish';
        setIsRevealed(true);
        return;
      }

      setNextCard();
    },
    onMissButtonPress: event => {
      event.preventDefault();
      updateGrade(Grade.Miss);
    },
    onLevelUpButtonPress: event => {
      event.preventDefault();

      updateGrade(
        Grade.getGradeFromId(Grade.getGradeFromName(card.grade).id + 1),
      );
    },
  });
};
