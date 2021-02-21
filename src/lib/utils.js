const DAY = 24 * 60 * 60;

export function fillArray(content, length) {
  return Array.from(
    {
      length,
    },
    () => content
  );
}

export function formatTime(seconds) {
  if (seconds > DAY) {
    return "> 24h";
  }

  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

const AVERAGE_PLAY_DURATION = 3;
const MAX_TIME_BONUS = 50;

export function getRandomNumberBetween(min, max, excluding = []) {
  const number = Math.floor(Math.random() * (max - min + 1) + min);

  if (excluding.includes(number)) {
    return getRandomNumberBetween(min, max, excluding);
  }

  return number;
}

export function getSpaceIndexes(input) {
  if (!input) return [];

  return Array.from(input).reduce(
    (indexes, character, index) =>
      character === " " ? [...indexes, index] : indexes,
    []
  );
}

export function getTimeBonusForPlay({ elapsedSeconds, numberOfPeople }) {
  const cycleDuration =
    (numberOfPeople * AVERAGE_PLAY_DURATION) / MAX_TIME_BONUS;

  return Math.max(
    0,
    MAX_TIME_BONUS - Math.floor(elapsedSeconds / cycleDuration)
  );
}

export function obfuscateString(input, positionsRevealed) {
  return Array.from(input).reduce((result, char, index) => {
    return result + (positionsRevealed.includes(index) ? char : "?");
  }, "");
}
