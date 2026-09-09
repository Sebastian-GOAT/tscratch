# Watermark

`Watermark` is a `Text` sprite with defaults intended for a small corner
label. Its default content is `Made with TScratch`, its alignment is `left`,
and its baseline is `top`.

```ts
const mark = new Watermark({
    content: 'My game',
    color: 'white',
    fontSize: 12
});
```

It accepts the same text options and setters as `Text`, including
`setContent`, `setColor`, `setFontSize`, `setFontFamily`, `setAlign`, and
`setBaseline`. Supply `x` and `y` when the default canvas-corner position is
not suitable.