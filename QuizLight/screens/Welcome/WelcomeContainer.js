import React, {useEffect, useMemo, useRef, useState} from 'react';

import {CacheHandler, Grade} from '../../core';
import {QuestionsHandler} from '../../core/questions_handler';
import {WelcomeView} from './WelcomeView';

export const WelcomeContainer = ({navigation, route}) => {
  const gradesKey = '@grades_key';
  const isReversedKey = '@is_reversed_key';
  const defaultGradeIds = useMemo(() => [Grade.Miss.id, Grade.Serf.id], []);
  const defaultIsReversed = false;

  const isWelcomeMessageDisplayed = useRef(false);
  const [welcomeMessage, setWelcomeMessage] = useState(null);
  const [isReversed, setIsReversed] = useState(defaultIsReversed);
  const [isReloadCache, setIsReloadCache] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [gradeCheckboxes, setGradeCheckboxes] = useState([]);

  const cacheHandler = CacheHandler.getInstance();

  useEffect(() => {
    cacheHandler
      .getData(gradesKey, defaultGradeIds)
      .then(savedSelectedGradeIds => {
        const grades = Grade.Grades;
        const newGradeCheckboxes = [];

        setIsReady(savedSelectedGradeIds.length > 0);

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

                    setIsReady(gradeIds.length > 0);
                  });
                });
            },
          });
        }

        setGradeCheckboxes(newGradeCheckboxes);
      });
  }, [cacheHandler, gradesKey, defaultGradeIds]);

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
    isReversed: isReversed,
    isReloadCache: isReloadCache,
    isReady: isReady,
    gradeCheckboxes: gradeCheckboxes,
    onStartButtonPress: () => {
      if (!isReady) {
        return;
      }

      cacheHandler.getData(gradesKey, defaultGradeIds).then(savedGradeIds => {
        cacheHandler
          .getData(isReversedKey, defaultIsReversed)
          .then(savedIsReversed => {
            if (!isReloadCache) {
              QuestionsHandler.getInstance()
                .getQuestionCount(savedGradeIds)
                .then(count => {
                  if (count <= 0) {
                    setWelcomeMessage(
                      'No questions could be found with these parameters. Maybe you should try to reload the cache.',
                    );

                    return;
                  }

                  navigation.navigate('Quiz', {
                    gradeIds: savedGradeIds,
                    isReversed: isReversed,
                  });
                });

              return;
            }

            setIsReloadCache(false);

            navigation.navigate('Loading', {
              isReloadCache: isReloadCache,
              isReversed: savedIsReversed,
              gradeIds: savedGradeIds,
            });
          });
      });
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
