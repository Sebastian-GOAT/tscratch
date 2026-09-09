# Button

`Button` is a rectangular text control. Its options include `content`,
`fontColor`, `fontFamily`, `fontSize`, `width`, `height`, `backgroundColor`,
`outlineColor`, and `outlineWidth`, along with common `SpriteOptions`.

```ts
const start = new Button({
    content: 'Start',
    width: 140,
    height: 44,
    backgroundColor: 'limegreen',
    fontColor: 'white'
});

start.onPress(() => engine.setScene('game'));
```

Use `setContent`, `setBackgroundColor`, `setFontColor`, `setFontSize`, and
`setFontFamily` to update the control. Pointer behavior is documented in the
Input section.