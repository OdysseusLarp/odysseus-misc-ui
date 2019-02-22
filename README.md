# odysseus-misc-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Task list

```js
{
    type: 'task',
    id: '...',
    state: 'broken' / 'calibrating' / 'fixed' / 'hidden'
    sort: 123.45
    calibrationTime: 150
    calibrationCount: 3
    calibrationRemaining: [ 12, 13, 14 ]
    calibrationSpeed: [ 0.8, 1.0, 1.1 ]
    fixed_at: 423432432  // timestamp
    title: 'Foo'
    description: 'A longer explanation'
    map: 'map.png'
    important: true
}
```


