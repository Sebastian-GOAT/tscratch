# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

The dates are in the following format: DD.MM.YYYY

## [0.5.8] - 17.11.2025

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