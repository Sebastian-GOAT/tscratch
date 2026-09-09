# ImageSprite

`ImageSprite` displays an image costume. Its options include `costumes`,
`costumeNumber`, `width`, `height`, `outlineColor`, and `outlineWidth`.
`costumes` contains image URLs.

```ts
const player = new ImageSprite({
    costumes: ['/images/player-idle.png', '/images/player-run.png'],
    costumeNumber: 0,
    width: 48,
    height: 48
});

player.nextCostume();
```

Use `setCostume(number)`, `nextCostume()`, and `previousCostume()` to change
images. `setWidth` and `setHeight` resize the display area. Images load
asynchronously, so deployed asset URLs must be reachable by the browser.