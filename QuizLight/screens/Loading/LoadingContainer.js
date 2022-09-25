import React, {useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';

import {LoadingView} from './LoadingView';
import {QuestionsHandler} from '../../core/questions_handler';
import {CacheHandler} from '../../core';

export const LoadingContainer = ({navigation, route}) => {
  const isForcedReloadKey = '@is_forced_reload_key';

  const quizDescr = route.params.quizDescr;
  const isReloadCache = route.params.isReloadCache;
  const gradeIds = route.params.gradeIds;
  const isReversed = route.params.isReversed;

  useEffect(() => {
    async function fetchData() {
      let isOk = true;

      if (quizDescr === null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Welcome',
                params: {
                  welcomeMessage: 'No quiz available.',
                },
              },
            ],
          }),
        );

        return;
      }

      if (isReloadCache) {
        isOk = await QuestionsHandler.getInstance().reloadQuestions(quizDescr);
      }

      const questionCount =
        await QuestionsHandler.getInstance().getQuestionCount(
          quizDescr,
          gradeIds,
        );

      if (questionCount <= 0) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Welcome',
                params: {
                  welcomeMessage: isOk
                    ? 'Nothing to see here...'
                    : 'Someting wrong happened. Check your network connectivity and your settings.',
                },
              },
            ],
          }),
        );

        return;
      }

      CacheHandler.getInstance().setData(isForcedReloadKey, false);

      navigation.dispatch(state => {
        const routes = state.routes.filter(
          stateRoute => stateRoute.name !== 'Loading',
        );

        routes.push({
          name: 'Quiz',
          params: {
            quizDescr: quizDescr,
            gradeIds: gradeIds,
            isReversed: isReversed,
          },
        });

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    }

    fetchData();
  }, [quizDescr, isReversed, isReloadCache, gradeIds, navigation]);

  return React.createElement(LoadingView, {});
};
