# Collisions

Sadly, TScratch doesn't have a built in method for collision checking.
However, there might be some 3rd party libraries that extend TScratch
with collision checks.

But TScratch does have methods for mouse interactions! You can use the
`engine.isHovering(sprite)` method to check, if the user is hovering a
specific sprite. By combining this with `engine.mouseDown`, you can
create click events. You can also make your own custom events using
`engine.mouseX` and `engine.mouseY`.