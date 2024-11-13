export const getIdFromClassName = (input: string): string => {
  const regex = /designcombo-scene-item id-([^ ]+)/;
  const match = input.match(regex);
  return match ? match[1] : (null as unknown as string);
};

export const populateTransitionIds = (inputArray: string[]): string[] => {
  let newArray: string[] = [];

  for (let i = 0; i < inputArray.length; i++) {
    newArray.push(inputArray[i]);
    if (i < inputArray.length - 1) {
      newArray.push(`${inputArray[i]}-${inputArray[i + 1]}`);
    }
  }

  return newArray;
};
