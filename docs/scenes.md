# Scenes

TScratch supports scenes with the `scene` property. In every sprite you create,
you can specify, in which scene you want it to render. TScratch will default it
to 'main' if not specified.

After that, you can switch between scenes by using `engine.changeScene(scene)`.
TScratch will then render only the sprites, that belong in that specific scene.

You can also specify 1 loop per scene using `engine.setLoop(scene, callback)`.
Keep in mind that there is only 1 loop running at a time, which is the one
in the current scene.

If you're working on the main scene, you dont't have to initially switch scenes,
it is handled automaticly.