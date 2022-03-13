import * as React from 'react';
import {ScrollView, Text, TouchableHighlight, View} from 'react-native';

import {style} from '../styles';
import {CardAnswer, CardHeader, CardQuestion, CardNotes} from '.';

export const Card = props => {
  return (
    <View style={style.card}>
      <TouchableHighlight
        onPress={props.onPress}
        disabled={props.isRevealed}
        style={style.cardContent}>
        <ScrollView>
          <CardHeader id={props.id} grade={props.grade} />
          <CardQuestion question={props.question} />

          {props.isRevealed && (
            <>
              <CardAnswer answer={props.answer} />
              {props.notes && <CardNotes notes={props.notes} />}
            </>
          )}
        </ScrollView>
      </TouchableHighlight>

      {props.isRevealed && (
        <View style={style.cardButtons}>
          <TouchableHighlight
            onPress={props.onMissButtonPress}
            style={
              !props.cardButtonMissDisabled
                ? [style.cardButton, style.cardButtonMiss]
                : [
                    [
                      style.cardButton,
                      style.cardButtonMiss,
                      style.cardButtonDisabled,
                      style.cardButtonMissDisabled,
                    ],
                  ]
            }
            disabled={props.cardButtonMissDisabled}>
            <Text
              style={
                !props.cardButtonMissDisabled
                  ? [style.cardButtonText]
                  : [style.cardButtonText, style.cardButtonTextDisabled]
              }>
              ✖
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={props.onLevelUpButtonPress}
            style={
              !props.cardButtonLevelUpDisabled
                ? [style.cardButton, style.cardButtonLevelUp]
                : [
                    [
                      style.cardButton,
                      style.cardButtonLevelUp,
                      style.cardButtonDisabled,
                      style.cardButtonLevelUpDisabled,
                    ],
                  ]
            }
            disabled={props.cardButtonLevelUpDisabled}>
            <Text
              style={
                !props.cardButtonLevelUpDisabled
                  ? [style.cardButtonText]
                  : [style.cardButtonText, style.cardButtonTextDisabled]
              }>
              ▲
            </Text>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
};
