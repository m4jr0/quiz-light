import * as React from 'react';
import {Text} from 'react-native';

import {style} from '../styles';
import {getTagBlocks} from '../utils';

function getTaggifiedListText(str) {
  if (!str) {
    return str;
  }

  const splitStrs = str.split('\n');
  const lines = [];

  for (const splitStr of splitStrs) {
    const blocks = getTagBlocks(splitStr);

    if (blocks === null) {
      continue;
    }

    lines.push(blocks);
  }

  let taggifiedText = [];

  for (let i = 0; i < lines.length; i++) {
    const blocks = lines[i];
    taggifiedText.push(
      <Text key={`blockBullet${i}`} style={style.cardBullet}>
        •{' '}
      </Text>,
    );

    for (let j = 0; j < blocks.length; j++) {
      const block = blocks[j];
      if (!block.isTag) {
        taggifiedText.push(<Text key={`block${i}${j}`}>{block.text}</Text>);
        continue;
      }

      taggifiedText.push(
        <Text key={`block${i}${j}`} style={style.cardTag}>
          {block.text}
        </Text>,
      );
    }

    taggifiedText.push(<Text key={`blockNewLine${i}`}>{'\n'}</Text>);
  }

  return taggifiedText;
}
export const TaggifiedListText = props => {
  return (
    <>
      <Text style={[props.style]}>{getTaggifiedListText(props.children)}</Text>
    </>
  );
};
