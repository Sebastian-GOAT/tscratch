# API Overview

## Engine (singleton)

### Initialization

- `Engine.init()` → get the singleton instance
- `engine.setMaxFramesPerSecond(FPS)`→ sets the maximum FPS

### Scenes

- `engine.setLoop(scene, callback)` → game loop logic
- `engine.changeScene(scene)` → changes the scene, renders only the targeted sprites

### Mouse

- `engine.isHovering(sprite)` → checks if the user is hovering a sprite with the mouse pointer

### Sound

- `engine.playSound(src)` → plays a sound
- `engine.stopAllSounds()` → stops all sounds

### Helpers

- `await engine.wait(ms)` → wait some time in milliseconds
- `engine.toRadians(rad)` → converts degrees to radians
- `engine.toDegrees(deg)` → converts radians to degrees

## Sprite (abstract)

### Movement

- `goTo(x, y)` → move to coordinates
- `setX(x)` / `setY(y)` → set position
- `changeX(x)` / `changeY(y)` → change position
- `turn(deg)` / `point(deg)` → change / set direction
- `changeX(dX)` / `changeY(dY)` → relative movement

### Looks

- `show()` → shows the sprite
- `hide()` → hides the sprite (prevents rendering => better preformance)
- `goToLayer(layer)` → swithes the current layer (z-indexing)
- `changeLayer(dL)` → moves forwards/backwards in layers (z-indexing)

## Rectangle (built-in sprite)

- `width` - the width
- `height` - the height
- `color` - the color

Draws a rectangle centered on `(x, y)`.

## RegularPolygon (built-in sprite)

- `radius` - the radius
- `sides` - the number of sides
- `color` - the color

Draws a polygon centered on `(x, y)`.

## Oval (built-in sprite)

- `radA` - radius A
- `radB` - radius B
- `color` - the color

Draws an oval centered on `(x, y)`.

## Text (built-in sprite)

- `content` - the text
- `color` - the color
- Other properties specifying the style.

Draws a label aligned to your preference.

## ImageSprite (built-in sprite)

- `src` - the source
- `width` - the width
- `height` - the height

Draws an image centered on `(x, y)`.

## Pen (built-in sprite)

- Has `color`, `size`, and `drawing` properties.
- `down()` → starts drawing
- `up()` → stops drawing
- `dot()` → draws a single dot

Movement methods, such as `move()`, can draw a line based on if `drawing` is true.

## Canvas (not a class)

- `setScale(scale)` → sets the scale of the stage
- `setAspectRatio(ratio)` → sets the aspect ratio of the stage

- `canvas` → the canvas element
- `ctx` → the 2D drawing context
- `penCtx` → the 2D drawing context for the pen layer