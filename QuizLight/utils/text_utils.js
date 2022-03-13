export function getTagBlocks(str) {
  if (!str) {
    return null;
  }

  const count = str.length;
  const blocks = [];
  let leftAnchor = 0;
  let leftStack = [];

  for (let i = 0; i < count; i++) {
    const c = str[i];

    if (c === '(') {
      leftStack.push(i);

      for (let j = i + 1; j < count; j++) {
        const subC = str[j];

        if (subC === '(') {
          leftStack.push(j);
          continue;
        }

        if (subC === ')') {
          if (leftStack.length === 1) {
            blocks.push({
              text: str.substring(leftAnchor, leftStack[0]),
              isTag: false,
            });

            blocks.push({
              text: str.substring(leftStack[0], j + 1),
              isTag: true,
            });

            leftAnchor = j + 1;
            i = j + 1;

            break;
          }

          leftStack.pop();
          continue;
        }
      }
    }

    leftStack = [];
  }

  blocks.push({
    text: str.substring(leftAnchor, str.length),
    isTag: false,
  });

  return blocks;
}
