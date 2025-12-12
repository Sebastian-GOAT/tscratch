# API Overview

## Engine (singleton)

### Initialization

- `Engine.init()` - get the singleton instance
- `setMaxFPS(FPS)`- sets the maximum FPS

### Scenes

- `setLoop(scene, callback)` - game loop logic
- `setScene(scene)` - changes the scene, renders only the targeted sprites

### Mouse Events

- `mouseX` - the x position of the cursor
- `mouseY` - the y position of the cursor
- `mouseDown` - checks if the user is holding the mouse button
- `mouseClicked` - checks if the user is has clicked the mouse button

- `hovering(sprite)` - checks if the user is hovering a sprite with the mouse pointer

### Keyboard Events

- `keyPressed(key)` - checks if the user pressed a key

### Sound

- `playSound(src)` - plays a sound
- `stopAllSounds()` - stops all sounds

### Time

- `deltaTime` - the time passed from the last frame (in seconds)

- `async wait(ms)` - wait some time in milliseconds
- `async waitUntil(() => condition)` - wait until a condition becomes true (pass a getter)

### Math

- `toRadians(rad)` - converts degrees to radians
- `toDegrees(deg)` - converts radians to degrees

- `pickRandom(min, max)` picks a random integer
- `dotProduct(vectors)` - computes the dot product between 2 vectors (Vec2 | Vec3 | Vec4)

- `sin(deg)` - computes the sine of an angle
- `cos(deg)` - computes the cosine of an angle
- `tan(deg)` - computes the tangent of an angle
- `csc(deg)` - computes the cosecant of an angle
- `sec(deg)` - computes the secant of an angle
- `cot(deg)` - computes the cotangent of an angle

- `asin(value)` - computes the inverse of sine
- `acos(value)` - computes the inverse of cosine
- `acsc(value)` - computes the inverse of cosecant
- `asec(value)` - computes the inverse of secant

## Sprite (abstract)

### Movement

- `x` - the x position (-left, +right, 0 center)
- `y` - the y position (-bottom, +top, 0 center)
- `dir` - the x position (-counterclockwise, +clockwise, 0 top)
- `pivot` - the pivot point of the sprite (rotation, position) (doesn't work with `touching(sprite)`)

- `goTo(x, y)` - move to coordinates
- `setX(x)` - set the x position
- `setY(y)` - set the y position
- `changeX(dX)` - changes the x position
- `changeY(dY)` - changes the y position
- `setPivot(x, y)` - sets the pivot (doesn't work with `touching(sprite)`)
- `turn(deg)` - changes the direction
- `point(deg)` - points in some direction
- `pointTowards(x, y)` - points towards coordinates
- `touching(sprite)` - checks for a collision with another sprite (doesn't work with pivots)

### Looks

- `size` - the scale factor (default 1)
- `scene` - the scene that it's rendered in (`*` for global rendering)
- `hidden` - is currently hidden?
- `layer` - the layer (z-index)

- `show()` - shows the sprite
- `hide()` - hides the sprite (prevents rendering => better preformance)
- `goToLayer(layer)` - swithes the current layer (z-indexing)
- `changeLayer(dL)` - moves forwards/backwards in layers (z-indexing)

## Rectangle (built-in sprite)

- `width` - the width
- `height` - the height
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setWidth(width)` - set the width
- `setHeight(height)` - set the height
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws a rectangle centered on `(x, y)`.

## Square (built-in sprite)

- `sideLength` - the side length
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setSideLength(sideLength)` - set the side length
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws a square centered on `(x, y)`.

## RegularPolygon (built-in sprite)

- `radius` - the radius
- `sides` - the number of sides
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setRadius(radius)` - set the radius
- `setSides(sides)`-  set the amount of sides
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws a regular polygon centered on `(x, y)`.

## CustomPolygon (built-in sprite)

- `vertices` - the vertices
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setVertices(vertices)` - set the vertices
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws a custom polygon centered on `(x, y)`.

## Oval (built-in sprite)

- `radX` - the radius X
- `radY` - the radius Y
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setRadX(radX)` - set the radius X
- `setRadY(radY)` - set the radius Y
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws an oval centered on `(x, y)`.

## Circle (built-in sprite)

- `radius` - the radius
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setRadius(radius)` - set the radius
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws a circle centered on `(x, y)`.

## Arc (built-in sprite)

- `radius` - the radius
- `angle` - the angle of the arc
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setRadius(radius)` - set the radius
- `setAngle(angle)` - set angle of the arc
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws an arc centered on `(x, y)`.

## Text (built-in sprite)

- `content` - the text
- `color` - the color
- `outlineWidth` - the border thickness
- `outlineColor` - the border color
- Other properties specifying the font style.

- `setContent(content)` - set the text content
- `setColor(color)` - set the color
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws a label aligned to your preference.

## Button (built-in sprite)

- Combined properties from `Rectangle` & `Button`

```ts
import { Button } from 'tscratch';

const engine = Engine.init();
const button = new Button();

engine.setLoop('main', () => {
    if (engine.mouseDown) {
        await engine.waitUntil(!engine.mouseDown);
        if (engine.hovering(button))
            console.log('Clicked!');
    }
});
```

Draws a button centered on `(x, y)`.

## Watermark (built-in sprite)

- Shares properties & methods with `Text`
- Used for attributing TScratch (default) or someone other

Draws a watermark on the top right of the canvas.

## Image (built-in sprite)

- `src` - the source
- `width` - the width
- `height` - the height
- `outlineWidth` - the border thickness
- `outlineColor` - the border color

- `setSrc(src)` - set the image source
- `setWidth(width)` - set the width
- `setHeight(height)` - set the height
- `setOutlineWidth(width)` - set the border thickness
- `setOutlineColor(color)` - set the border color

Draws an image centered on `(x, y)`.

## Pen (built-in sprite)

- `color` - the color
- `penSize` - the size of the stroke
- `drawing` - is currently drawing?

- `down()` - starts drawing
- `up()` - stops drawing
- `dot()` - draws a single dot
- `drawSprite(sprite)` - draws a sprite to the pen layer, doesn't get tracked by `Engine`

Movement methods, such as `move()`, can draw a line based on if `drawing` is true.

## WireframeRenderer3D (built-in sprite)

- All pen properties & methods

- `registerControls()` - handles movement events (per frame, can be overriden inside a subclass)
- `render()` - renders the objects (per frame)

Usage:
```ts
import { Engine, WireframeRenderer3D as Renderer } from 'tscratch';
import objects from './lib/data.ts';

const engine = Engine.init();
const renderer = new Renderer({ objects });

engine.setLoop('main', () => {
    renderer.eraseAll();
    renderer.registerControls();
    renderer.update();
});
```

## Canvas (not a class)

- `setScale(scale)` - sets the scale of the stage
- `setAspectRatio(ratio)` - sets the aspect ratio of the stage

- `canvas` - the canvas element
- `ctx` - the 2D drawing context
- `penCtx` - the 2D drawing context for the pen layer

## Multiplayer (client)

- `connect(serverURL)` - connects to the server & returns a singleton instance (serverURL defaults to 'http://localhost:3000')
- `broadcast<T>(eventName, data: T)` - sends some data to the server under an event key
- `on<T>(eventName, (data: T) => void)` - calls a callback function once it recives an event from the server

## Server (server)

- `clients` - a set of clients (sockets)

- `broadcast<T>(eventName, data: T, clients?: Socket[])` - sends some data to every client under an event key (specify clients to target
specific clients)
- `broadcastExcept<T>(eventName, data: T, clients?: Socket[])` - sends the data to everyone except the specified clients
- `on<T>(eventName, (data: T) => void))` - calls a callback function once it recives an event from the client
- `onJoin<T>(callback: (client) => void)` - calls a callback function once a new client joins
- `onLeave<T>(callback: (client) => void)` - calls a callback function once a client leaves