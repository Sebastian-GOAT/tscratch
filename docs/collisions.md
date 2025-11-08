# Collisions

Sprites have a `touching(sprite)` method, which can detect pixel perfect
collisions. It's optimized by first checking AABB (axis-aligned bounding
boxes), and only if they're overlapping, check for more. This is an **EXPERIMENTAL**
feature, and it might behave unpredictably for some sprites, like `RegularPolygon`.
It can also be **VERY SLOW**, as pixel perfect calculations can be very
computationaly heavy.

TScratch also has methods for mouse interactions! You can use the
`engine.isHovering(sprite)` method to check, if the user is hovering a
specific sprite. By combining this with `engine.mouseDown`, you can
create click events. You can also make your own custom events using
`engine.mouseX` and `engine.mouseY`.