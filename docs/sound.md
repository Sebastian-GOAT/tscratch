# Sound

TScratch provides a minimal audio API for playing short effects and music.

- `engine.playSound(src)` — play an audio source (URL or local asset).
- `engine.stopAllSounds()` — stop all currently playing audio.

Browser note: many browsers block autoplaying audio until the user interacts
with the page — call `playSound` in response to a user action (click, key
press) to ensure audio plays reliably.