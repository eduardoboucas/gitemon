const DAY = 24 * 60 * 60;

export function formatTime(seconds) {
  if (seconds > DAY) {
    return "> 24h";
  }

  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

const AVERAGE_PLAY_DURATION = 3;
const MAX_TIME_BONUS = 50;

export function getTimeBonusForPlay({ elapsedSeconds, numberOfPeople }) {
  const cycleDuration =
    (numberOfPeople * AVERAGE_PLAY_DURATION) / MAX_TIME_BONUS;

  return Math.max(
    0,
    MAX_TIME_BONUS - Math.floor(elapsedSeconds / cycleDuration)
  );
}
