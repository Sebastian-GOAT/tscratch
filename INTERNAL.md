# Internal

This file documents internal changes in the source codes architecture.

Please keep the format the same for all updates.
The dates are in the following format: DD.MM.YYYY

## 17.11.2025

- `Engine` - used a optimized `Map` for `sceneMap` instead of plain objects
- `Sprite` - returns `false` if at least one of the sprites is hidden