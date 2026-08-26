# Sound

TScratch provides a minimal audio API for playing short effects and music.

```ts
const sound = engine.playSound('/sound.mp3', {
	volume: 0.8,
	loop: false
});

engine.stopSound(sound);
```

- `engine.playSound(src, options?)` — play an audio source (URL or local asset)
	and return its `HTMLAudioElement`.
  - `options.volume` — volume from `0` to `1`.
  - `options.loop` — whether the sound should repeat.
- `engine.stopSound(sound)` — stop the sound.
- `engine.stopAllSounds()` — stop all sounds that are currently playing.

Browser note: many browsers block autoplaying audio until the user interacts
with the page — call `playSound` in response to a user action (click, key
press) to ensure audio plays reliably.