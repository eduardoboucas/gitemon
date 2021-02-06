const DAY = 24 * 60 * 60;

export function formatTime(seconds) {
  if (seconds > DAY) {
    return "> 24h";
  }

  return new Date(seconds * 1000).toISOString().substr(11, 8);
}
