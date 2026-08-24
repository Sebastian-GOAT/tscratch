# API Overview

This document summarizes the public API surface of TScratch. It is intended as a
concise reference — see the source for full typings and examples.

## Engine (singleton)

Initialization

- `const engine = Engine.init()` — initialize the engine and retrieve the
    singleton instance.
- `engine.setMaxFPS(fps)` — cap the update/render rate.

Scenes

- `engine.setLoop(scene, callback)` — register the frame callback for a scene.
- `engine.setScene(scene)` — switch the active scene; only sprites in the active
    scene are rendered.

Input

- `engine.mouseX`, `engine.mouseY` — cursor position in stage coordinates.
- `engine.mouseDown` — whether a mouse button is currently pressed.
- `engine.hovering(sprite)` — whether the cursor is over `sprite`.
- `engine.keyPressed(key)` — whether `key` is currently pressed.

Sound

- `engine.playSound(src)` — play an audio source.
- `engine.stopAllSounds()` — stop all currently playing sounds.

Timing / Utilities

- `engine.getDeltaTime()` — actual seconds elapsed since the previous game
    update (useful for frame-rate independent movement).
- `await engine.wait(ms)` — delay for `ms` milliseconds.
- `await engine.waitUntil(() => condition)` — pause until `condition()` returns
    true.
- `new Timer(startSeconds?)` — create a stopwatch, initially paused, with an
    optional starting time in seconds.
- `timer.getTime()` — get the elapsed time in seconds.
- `timer.isRunning()` — check whether the timer is running.
- `timer.start()` / `timer.pause()` — start, resume, or pause the timer.
- `timer.lap()` — record and return the time in seconds since the previous lap.
- `timer.getLaps()` — get a copy of all recorded lap times in seconds.
- `timer.reset()` — stop the timer, reset its elapsed time to zero, and clear
    recorded laps.
- `timer.addTime(seconds)` — add seconds to the elapsed time.

## TSCMath (static utilities)

- `TSCMath.toRadians(deg)`, `TSCMath.toDegrees(rad)` — angle conversions.
- `TSCMath.pickRandom(min, max)` — integer random in range.
- Vector helpers: `dotProduct(...)` and basic trig helpers (`sin`, `cos`,
    `tan`, `asin`, `acos`, etc.).

## Perlin noise

- `Perlin1D` and `Perlin2D` — generators for procedural noise.
- `get(x)` / `get(x, y)` — sample noise value.
- `regen()` — regenerate the underlying noise map.

## Inverse Kinematics

- Utilities to compute joint positions and angles for multi-segment chains.
- `computeApproximateAngles(iterations, error, adjustmentRate?)` — run a solver.
- `getAngles()` and `getPoints()` — read computed values.

## Sprites (common properties)

- Position: `x`, `y` (stage coordinates).
- Direction: `dir` (degrees).
- `pivot` (rotation/pivot point).
- Visibility and layering: `hidden`, `size`, `scene`, `layer`.
- Movement: `goTo`, `setX`, `setY`, `changeX`, `changeY`, `turn`, `point`,
    `pointTowards`.
- Appearance: `show()`, `hide()`, `goToLayer()`, `changeLayer()`.
- Collision: `touching(otherSprite)`

## Built-in sprite types

- Rectangle / Square / Circle / Oval / Arc / RegularPolygon / CustomPolygon / Line
    — shapes with simple property APIs (`width`, `height`, `radius`, `vertices`,
    `color`, `outlineWidth`, `outlineColor`, etc.) and corresponding setters.
- `Text` — render textual labels.
- `Button` — interactive rectangle-based button (combines rectangle + click
    helpers).
- `Image` — draw images by `src`, with width/height and outline options.
- `Pen` — drawing API (`down()`, `up()`, `dot()`, and `drawSprite(...)`).

## 3D renderers

- `WireframeRenderer3D` / `SolidRenderer3D` — helpers for simple 3D object
    rendering; include control registration and per-frame `render()`.

## Canvas helpers

- `setScale(scale)`, `setAspectRatio(ratio)`, plus access to the underlying
    `canvas`, `ctx`, and `penCtx` contexts.

## Multiplayer (client)

- `const m = new Multiplayer(serverUrl)` — connect to a server.
- `m.emit(event, data)`, `m.on(event, handler)`, `m.disconnect()` — basic
    event-driven API.
- Room helpers: `createRoom(state, password?)`, `joinRoom(roomId, state?)`,
    `leaveRoom()`, `updatePlayerState(state)`, `onRoomJoin(handler)`,
    `onRoomLeave(handler)`, `getRoomPlayerState()`.

## Server / RoomManager (server)

- `Server` exposes `onJoin`, `onLeave`, `on(event, handler)`, `broadcast(...)`,
    and `broadcastExcept(...)`.
- `RoomManager` maintains `rooms: Map<roomId, { password, clients }>` and
    helpers to update player state, disable/enable joining, kick/ban clients, and
    listen for join/leave events.

For full type information and examples, consult the source files and tests.