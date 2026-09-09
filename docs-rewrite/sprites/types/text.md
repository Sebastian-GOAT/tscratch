# Text

`Text` renders a string or number. Its options are `content`, `color`,
`fontFamily`, `fontSize`, `align`, and `baseline`, plus common `SpriteOptions`.

```ts
const score = new Text({
    content: 'Score: 0',
    fontFamily: 'sans-serif',
    fontSize: 24,
    color: 'white'
});

score.setContent('Score: 10');
```

Use `setContent`, `setColor`, `setFontSize`, `setFontFamily`, `setAlign`, and
`setBaseline` to update the text.