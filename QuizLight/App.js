import * as React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {WelcomeContainer} from './screens/Welcome';
import {LoadingContainer} from './screens/Loading';
import {QuizContainer} from './screens/Quiz';
import {QuizSelectorContainer} from './screens/QuizSelector';

const Stack = createNativeStackNavigator();

export const QuizLight = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeContainer} />
        <Stack.Screen name="QuizSelector" component={QuizSelectorContainer} />
        <Stack.Screen
          name="Loading"
          component={LoadingContainer}
          headerShown={false}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Quiz" component={QuizContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
