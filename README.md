# odysseus-misc-ui

Misc UI includes following misc apps
- Airlocks
- Infoboard
- Engineering task list, task details and task map

## Tech

- Node v18.14.0
- Vue v2.7.14

## Local setup

* **`NOTE!`** Make sure you are running [Odysseus Backend](https://github.com/OdysseusLarp/odysseus-backend)!
* Run `npm install` to install dependencies
* Run `npm run serve` for compiles and hot-reloads for development

Misc UI should now be available at [http://localhost:8082/](http://localhost:8082/)

## Local setup in VSCode dev container

You can also run the app using [VSCode dev containers](https://code.visualstudio.com/docs/devcontainers/containers). Create/update your .env file like in the local setup instructions.

### Requirements

- [Docker](https://www.docker.com/)
- [VSCode](https://code.visualstudio.com/) with [Dev Containers](https://code.visualstudio.com/docs/devcontainers/tutorial#_install-the-extension) extension
- [Odysseus Backend](https://github.com/OdysseusLarp/odysseus-backend)

### Setup

* **`NOTE!`** Make sure you are running `Odysseus Backend`!
* Open new window in VSCode
* File --> Open Folder... --> `odysseus-misc-ui`
* VSCode will ask do you want to `Reopen in Container` --> Click it
    * If you are too slow --> Click the button in left bottom corner (looks like two L:s or disjointed ><) and choose `Reopen in Container` from the menu.
* VSCode will then build and start up the dev container, installs npm packages and starts the service.

### Problems?

* Try to rebuild the container: Click the button in left bottom corner (looks like two L:s or disjointed >< with the container name) and choose `Rebuild Container` from the menu.
* You might run into [this issue](https://github.com/microsoft/vscode-remote-release/issues/7305) on ARM processors, see the issue for potential workarounds.

## Task list

```js
{
    type: 'task',
    id: '...',
    status: 'broken' / 'calibrating' / 'fixed' / 'hidden'
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

## Other Available Scripts

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


