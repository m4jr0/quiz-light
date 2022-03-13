import * as React from 'react';
import {Text} from 'react-native';

import {style} from '../styles';
import {getTagBlocks} from '../utils';

function getTaggifiedText(str) {
  const blocks = getTagBlocks(str);

  if (blocks === null) {
    return null;
  }

  let taggifiedText = [];

  for (let i = 0; i < blocks.length; i++) {
    const word = blocks[i];
    if (!word.isTag) {
      taggifiedText.push(<Text key={`word_${i}`}>{word.text}</Text>);
      continue;
    }

    taggifiedText.push(
      <Text key={`word_${i}`} style={style.cardTag}>
        {word.text}
      </Text>,
    );
  }

  return taggifiedText;
}

export const TaggifiedText = props => {
  return (
    <>
      <Text style={[props.style]}>{getTaggifiedText(props.children)}</Text>
    </>
  );
};
