# Sound management

Use the engine to play and stop audio:

```ts
const engine = Engine.init();
const music = engine.playSound('/audio/music.mp3', {
	volume: 0.5,
	loop: true
});

engine.stopSound(music);
engine.stopAllSounds();
```

`SoundOptions` accepts `volume` from `0` to `1` and a boolean `loop`. The
`playSound` method returns the `HTMLAudioElement` it started, so pass that
value to `stopSound` when you want to stop one sound.