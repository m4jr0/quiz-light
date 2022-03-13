import React, {useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';

import {LoadingView} from './LoadingView';
import {QuestionsHandler} from '../../core/questions_handler';

export const LoadingContainer = ({navigation, route}) => {
  const gradeIds = route.params.gradeIds;
  const isReversed = route.params.isReversed;
  const isReloadCache = route.params.isReloadCache;

  useEffect(() => {
    async function fetchData() {
      let isOk = true;

      if (isReloadCache) {
        isOk = await QuestionsHandler.getInstance().reloadQuestions();
      }

      const questionCount =
        await QuestionsHandler.getInstance().getQuestionCount(gradeIds);

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

      navigation.dispatch(state => {
        const routes = state.routes.filter(
          stateRoute => stateRoute.name !== 'Loading',
        );

        routes.push({
          name: 'Quiz',
          params: {
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
  }, [isReversed, isReloadCache, gradeIds, navigation]);

  return React.createElement(LoadingView, {});
};
