import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';

import {CacheHandler, Grade} from '../../core';
import {QuestionsHandler} from '../../core/questions_handler';
import {WelcomeView} from './WelcomeView';

export const WelcomeContainer = ({navigation, route}) => {
  const isFocused = useIsFocused();

  const quizKey = '@quiz_key';
  const gradesKey = '@grades_key';
  const isReversedKey = '@is_reversed_key';
  const isForcedReloadKey = '@is_forced_reload_key';
  const defaultQuizName = 'No quiz selected';
  const defaultGradeIds = useMemo(() => [Grade.Miss.id, Grade.Serf.id], []);
  const defaultIsReversed = false;

  const isWelcomeMessageDisplayed = useRef(false);
  const [isForcedReload, setIsForcedReload] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState(null);
  const [quizDescr, setQuizDescr] = useState(null);
  const [isReversed, setIsReversed] = useState(defaultIsReversed);
  const [isReloadCache, setIsReloadCache] = useState(isForcedReload);
  const [isReady, setIsReady] = useState(false);
  const [gradeCheckboxes, setGradeCheckboxes] = useState([]);

  const cacheHandler = CacheHandler.getInstance();

  useEffect(() => {
    cacheHandler.getData(isForcedReloadKey, true).then(savedIsForcedReload => {
      if (isFocused) {
        console.log(`>:3 DEF ${savedIsForcedReload}`);
        if (isForcedReload === savedIsForcedReload) {
          return;
        }

        setIsForcedReload(savedIsForcedReload);
      }
    });
  }, [cacheHandler, isForcedReload, isFocused]);

  useEffect(() => {
    cacheHandler.getData(quizKey, null).then(savedQuizDescr => {
      if (JSON.stringify(quizDescr) === JSON.stringify(savedQuizDescr)) {
        return;
      }

      setQuizDescr(savedQuizDescr);
    });
  }, [cacheHandler, quizDescr]);

  useEffect(() => {
    cacheHandler.getData(quizKey, null).then(savedQuizDescr => {
      if (JSON.stringify(quizDescr) === JSON.stringify(savedQuizDescr)) {
        return;
      }

      setQuizDescr(savedQuizDescr);
    });
  }, [cacheHandler, quizDescr]);

  useEffect(() => {
    cacheHandler
      .getData(gradesKey, defaultGradeIds)
      .then(savedSelectedGradeIds => {
        const grades = Grade.Grades;
        const newGradeCheckboxes = [];

        setIsReady(quizDescr !== null && savedSelectedGradeIds.length > 0);

        for (const grade of grades) {
          newGradeCheckboxes.push({
            id: grade.id,
            label: grade.name,
            checked: savedSelectedGradeIds.includes(grade.id),
            onPress: (event, newIsChecked) => {
              event.preventDefault();

              cacheHandler
                .getData(gradesKey, defaultGradeIds)
                .then(gradeIds => {
                  if (newIsChecked) {
                    gradeIds.push(grade.id);
                  } else {
                    gradeIds.splice(gradeIds.indexOf(grade.id), 1);
                  }

                  cacheHandler.setData(gradesKey, gradeIds).then(isSet => {
                    if (!isSet) {
                      return;
                    }

                    setIsReady(quizDescr !== null && gradeIds.length > 0);
                  });
                });
            },
          });
        }

        setGradeCheckboxes(newGradeCheckboxes);
      });
  }, [cacheHandler, quizDescr, gradesKey, defaultGradeIds]);

  useEffect(() => {
    cacheHandler
      .getData(isReversedKey, defaultIsReversed)
      .then(savedIsReversed => {
        setIsReversed(savedIsReversed);
      });
  }, [cacheHandler, isReversedKey, defaultIsReversed]);

  useEffect(() => {
    if (route.params && !isWelcomeMessageDisplayed.current) {
      isWelcomeMessageDisplayed.current = true;
      setWelcomeMessage(route.params.welcomeMessage);
    } else {
      setWelcomeMessage(null);
    }
  }, [route.params, welcomeMessage]);

  useEffect(() => {
    async function initializeSettings() {
      const questionsHandler = QuestionsHandler.getInstance();

      if (!questionsHandler.isInitialized) {
        await questionsHandler.initialize();
      }
    }

    initializeSettings();
  });

  return React.createElement(WelcomeView, {
    welcomeMessage: welcomeMessage,
    quizName: quizDescr !== null ? quizDescr.quizName : defaultQuizName,
    isReversed: isReversed,
    isReloadCache: isReloadCache,
    isReady: isReady,
    gradeCheckboxes: gradeCheckboxes,
    isForcedReload: isForcedReload,
    onStartButtonPress: () => {
      if (!isReady) {
        return;
      }

      if (quizDescr === null) {
        setWelcomeMessage(
          'No quiz could be found. Maybe you should try to reload the cache.',
        );

        return;
      }

      cacheHandler.getData(gradesKey, defaultGradeIds).then(savedGradeIds => {
        cacheHandler
          .getData(isReversedKey, defaultIsReversed)
          .then(savedIsReversed => {
            if (!isReloadCache) {
              QuestionsHandler.getInstance()
                .getQuestionCount(quizDescr, savedGradeIds)
                .then(count => {
                  if (count <= 0) {
                    setWelcomeMessage(
                      'No questions could be found with these parameters. Maybe you should try to reload the cache.',
                    );

                    return;
                  }

                  cacheHandler.setData(isForcedReloadKey, false).then(isSet => {
                    console.log(`>:3 Forced set: ${isSet}`);
                  });

                  navigation.navigate('Quiz', {
                    quizDescr: quizDescr,
                    gradeIds: savedGradeIds,
                    isReversed: isReversed,
                  });
                });

              return;
            }

            setIsReloadCache(false);

            navigation.navigate('Loading', {
              quizDescr: quizDescr,
              isReloadCache: isReloadCache,
              isReversed: savedIsReversed,
              gradeIds: savedGradeIds,
            });
          });
      });
    },
    onQuizSelectorButtonPress: () => {
      navigation.navigate('QuizSelector', {});
    },
    onIsReversedValueChange: newIsReversed => {
      cacheHandler.setData(isReversedKey, newIsReversed).then(isSet => {
        if (!isSet) {
          return;
        }

        setIsReversed(newIsReversed);
      });
    },
    onIsReloadCacheValueChange: newIsReloadCache => {
      setIsReloadCache(newIsReloadCache);
    },
  });
};
