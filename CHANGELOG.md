# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

The dates are in the following format: D?D.M?M.YYYY

## [0.8.6] - 19.2.2026

### Added

- `InverseKinematics` - a class for 2D multijointed inverse kinematics computing

### Changed

- Pen canvas has been moved behind the main canvas

## [0.8.5] - 17.2.2026

### Added

- `Perlin1D` & `Perlin2D` for random terrain generation

## [0.8.4] - 31.1.2026

### Changed

- `Pen.drawSprite(spriteConstructor, options)` is now static and type-safe

### Fixed

- `ImageSprite` AABB calculation is now tighter and more efficient

## [0.8.2] - 19.12.2025

### Changed

- `Engine` is back to a singleton class due to unexpected behaivior

### Removed

- `Camera`

## [0.8.0] - 19.12.2025

### Added

- `Camera`, `Camera3D` for offsetting

### Changed

- `Engine` is now a static class, use `Engine.init()` once at the beginning, then use static properties & methods (critical)
- Math methods moved to a static class `TSCMath`

## [0.7.4] - 15.12.2025

### Added

- `Cuboid` 3D object
- `SolidRenderer3D` for rendering solid objects

## [0.7.3] - 14.12.2025

### Added

- `Object3D.loadObj(srcCode)` static method that parses raw .obj contents into vertices and faces, which can be directly passed to a 3D object
- Built-in 3D objects:
    - Tetrahedron
    - Cube
    - Octahedron
    - Icosahedron
    - Icosphere
    - Monkey

### Changed

- Default `Engine.maxFPS` changed from 24 to 30
- Renamed `WireFrameRenderer3D.update()` to `WireFrameRenderer3D.render()`

## [0.7.2] - 12.12.2025

### Added

- `pivot`, `setPivot(x, y)` to add offsets to sprites (doesn't work witg touching())
- `WireframeRenderer3D`, a sprite that can render any wireframe of a model given its vertices and coords
- `Object3D` to easily manage 3D objects for `WireframeRenderer3D`

## [0.7.1] - 7.12.2025

### Added

- The `drawSprite(sprite)` method on `Pen` allows drawing sprites to the pen layer

### Changed

- Renamed `engine.changeScene(scene)` to `engine.setScene(scene)`
- Renamed `engine.setMaxFramesPerSecond(FPS)` to `engine.setMaxFPS(FPS)`

## [0.7.0] - 1.12.12.2025

### Added

- `size` property on `Sprite` for easy resizing

### Changed

- The `size` property on `Pen` was changed to `penSize` after the addition of the `size` property on `Sprite`

### Fixed

- Bounding box calculations for some sprites

## [0.6.9] - 26.11.2025

### Added

- `tags` property on `Sprite`, can be used to filter between different sprites

### Fixed

- `getBoundingBox()` is now implemented correctly, so `touching(sprite)` checks shouldn't be a problem
- `clone()` should work better now

## [0.6.6] - 25.11.2025

### Added

- `RigidCircle` - A built-in rigid body sprite (only collides with circles)
- `RigidBodyOptions` - Implement & create your own rigid bodies (use engine.sceneMap to access sprites)

### Fixed

- `Watermark` not drawing initially
- Optimized `touching(sprite)` by tightening the bounding boxes

## [0.6.5] - 24.11.2025

### Added

- `Watermark` sprite

### Fixed

- `Button` & `Text` sprites now also accept numbers as content

## [0.6.4] - 23.11.2025

### Added

- `Mat2`, `Mat3`, `Mat4` types
- `Button` sprite
- `space`, `up`, `down`, `left`, `right`, `any` keyboard events
- Global variables with `setVariable(key, value)`, `getVariable(key)` (not type safe)

## [0.6.2] - 20.11.2025

### Added

- `broadcastExcept(eventName, data, except)` - method on `Server`
- `onJoin(callback)` - method on `Server`
- `onLeave(callback)` - method on `Server`

## [0.6.0] - 19.11.2025

### Added

- `Multiplayer` class with realtime updates
- `Server` class to manage the backend for multiplayer experiences
- direct access to `scale` & `aspectRatio` for canvas

## [0.5.9] - 17.11.2025

### Added

- `clone(options)` method on Sprite, allows you to create copies of sprites while keeping their properties the same

## [0.5.8] - 13.11.2025

### Added

- `Arc` sprite
- `CustomPolygon` **EXPERIMENTAL** sprite, allows you to define custom polygons with your own vertices
- `Vec2`, `Vec3`, `Vec4` types for better readability & reusability
- `dotProduct(vectors)` method on engine

## [0.5.7] - 12.11.2025

### Fixed

- `ereaseAll()` -> `eraseAll()` typo

## [0.5.6] - 8.11.2025

### Added

- `deltaTime` property on Engine (seconds between the last 2 frames)

### Changed

- `isKeyPressed(key)` method on Engine renamed to `keyPressed(key)`
- `isHovered(sprite)` method on Engine renamed to `hovering(sprite)`
- `*` special scene name for global sprites (doesn't apply to loops)

## [0.5.3] - 8.11.2025

### Added

- `getBoundingBox()` abstract method on Sprite (must be implemented on sprites that inherit directly from Sprite)
- `touching(sprite)` method on Sprite (experimental, works unpredictably for `RegularPolygon`)

### Changed

- `radX, radY` instead of `radA, radB` on Oval

## [0.5.0] - 3.11.2025

### Added

- `pauseLoop()` method on engine - pauses the execution of the current loop
- `resumeLoop()` method on engine - resumes the execution of the current loop

## [0.4.9] - 2.11.2025

### Added

- `async waitUntil(() => condition)` method on Engine
- `Square` sprite

## [0.4.8] - 28.10.2025

### Added

- `pointTowards(x, y)` method on Sprite (no need for `Math.atan2` now)

## [0.1.0] - 28. 9. 2025 22:24:42 (initial)