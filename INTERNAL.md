# Internal

This file documents the internal structure of the source code.

## Sprite

### getBoundingBox

The `getBoundingBox` method returns the tightest possible rectangle around itself. It is optimized with trigonometric functions
applied to its direction to achieve maximum tightness.

## Multiplayer

The multiplayer feature is built on top of `socket.io` and `scoket.io-client` to provide a higher level API to the user.