import * as React from 'react';
import {Text, ToastAndroid, View} from 'react-native';

import {
  FabButton,
  FooterButton,
  LabeledPopCheckbox,
  PopCheckboxes,
} from '../../components';
import {style} from '../../styles';

export const WelcomeView = props => {
  if (props.welcomeMessage !== null) {
    ToastAndroid.showWithGravity(
      props.welcomeMessage,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    );
  }

  return (
    <View style={style.basicContainer}>
      <View style={style.welcomeParameters}>
        <Text style={[style.label, style.welcomeTitle]}>{props.quizName}</Text>
        <Text style={[style.label, style.welcomeLabel]}>Grades</Text>
        <PopCheckboxes checkboxDescrs={props.gradeCheckboxes} />
        <Text style={[style.label, style.welcomeLabel]}>Misc</Text>
        <View>
          <LabeledPopCheckbox
            label="Reverse Mode"
            checked={props.isReversed}
            onValueChange={props.onIsReversedValueChange}
          />
          <LabeledPopCheckbox
            label="Reload Cache"
            checked={props.isReloadCache}
            onValueChange={props.onIsReloadCacheValueChange}
            disabled={props.isForcedReload}
          />
        </View>
        <FabButton
          title="Quiz"
          onPress={props.onQuizSelectorButtonPress}
          style={style.quizSelectorButton}
        />
      </View>
      <FooterButton
        disabled={!props.isReady}
        title="Start"
        onPress={props.onStartButtonPress}
        style={style.litButton}
      />
    </View>
  );
};
