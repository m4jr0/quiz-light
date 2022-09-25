import React, {useEffect, useState} from 'react';
import {CommonActions} from '@react-navigation/native';

import {CacheHandler, GSheetHandler} from '../../core';
import {QuizSelectorView} from './QuizSelectorView';
import Config from 'react-native-config';

export const QuizSelectorContainer = ({navigation, route}) => {
  const quizKey = '@quiz_key';
  const isForcedReloadKey = '@is_forced_reload_key';
  const cacheHandler = CacheHandler.getInstance();
  const [currentQuizDescr, setCurrentQuizDescr] = useState([]);
  const [quizDescrs, setQuizDescrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setCurrentQuizDescr(cacheHandler.getData(quizKey, null));

      const handler = new GSheetHandler(
        Config.GOOGLE_SERVICE_CLIENT_EMAIL,
        Config.GOOGLE_SERVICE_PRIVATE_KEY,
        Config.GOOGLE_API_SCOPES,
      );

      const response = await handler.getValues(
        Config.QUIZ_LIST_SPREADSHEET_ID,
        Config.QUIZ_LIST_SHEET_NAME,
        Config.QUIZ_LIST_SHEET_RANGE,
      );

      if (response === null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Welcome',
                params: {
                  welcomeMessage:
                    'Could not retrieve quiz list. Check your internet connection.',
                },
              },
            ],
          }),
        );

        return;
      }

      const count = response.values.length;
      const newQuizDescrs = [];

      for (let i = 0; i < count; i++) {
        const row = response.values[i];

        if (!row || row.length < 5) {
          continue;
        }

        const isEnabled = row[0] && row[0].trim().toLowerCase() === 'true';

        if (!isEnabled) {
          continue;
        }

        const quizName = row[1].trim();
        const spreadsheetId = row[2].trim();
        const sheetName = row[3].trim();
        const sheetRange = row[4].trim();

        if (!quizName || !spreadsheetId || !sheetName || !sheetRange) {
          continue;
        }

        const quizDescr = {
          quizName: quizName,
          quizId: `${spreadsheetId}:${sheetName}`,
          spreadsheetId: spreadsheetId,
          sheetName: sheetName,
          sheetRange: sheetRange,
        };

        newQuizDescrs.push(quizDescr);
      }

      if (!isCancelled) {
        setQuizDescrs(newQuizDescrs);
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [cacheHandler, navigation]);

  return React.createElement(QuizSelectorView, {
    isLoading: isLoading,
    currentQuizDescr: currentQuizDescr,
    quizDescrs: quizDescrs,
    onPickerChanged: value => {
      let newQuizDescr = null;

      if (quizDescrs !== null) {
        for (const quizDescr of quizDescrs) {
          if (value === quizDescr.quizId) {
            newQuizDescr = quizDescr;
            break;
          }
        }
      }

      setCurrentQuizDescr(newQuizDescr);
    },
    onSaveButtonPress: () => {
      cacheHandler.setData(quizKey, currentQuizDescr).then(isSet => {
        if (!isSet) {
          return;
        }

        let welcomeMessage;

        if (!isSet) {
          welcomeMessage = 'Could not set quiz!';
        } else if (currentQuizDescr === null) {
          welcomeMessage = 'No quiz selected.';
        } else {
          welcomeMessage = `Selected quiz: ${currentQuizDescr.quizName}`;
        }

        cacheHandler.setData(isForcedReloadKey, true);

        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Welcome',
                params: {
                  welcomeMessage: welcomeMessage,
                },
              },
            ],
          }),
        );
      });
    },
  });
};
