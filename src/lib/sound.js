const sounds = ["/sound/partial.mp3", "/sound/full.mp3", "/sound/win.mp3"];

export function playSound(number) {
  const sound = new Audio(sounds[number]);

  sound.play();
}
