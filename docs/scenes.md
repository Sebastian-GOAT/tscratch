# Scenes

TScratch supports scene-based rendering to help organize larger projects. Each
sprite may belong to a named `scene` (default: `main`). Only sprites assigned
to the active scene are rendered and updated.

API highlights

- `engine.setScene(scene)` — change the active scene.
- `engine.setLoop(scene, callback)` — register a loop callback for a scene.

Behavior notes

- Only one scene is active at a time; the engine runs the loop associated with the active scene.
- By default, sprites are placed in the `main` scene; you do not need to call
	`setScene('main')` unless you switch to another scene first.

Organize each scene in its own module and register scene loops from your entry
point to keep scene logic clear and testable.