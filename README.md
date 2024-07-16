# odysseus-misc-ui

Misc UI contains a few different apps.

## Infoboard
Separate color scheme for lunar, solar and twilight shifts. Displays information about latest news, votes, ship log events, announcements and jump countdown.

![Screenshot 2024-07-16 at 9 24 10](https://github.com/user-attachments/assets/6c003a4d-e2e3-4966-9148-6eb4ee00ac5b)

## Airlock controls
![Screenshot 2024-07-16 at 9 25 15](https://github.com/user-attachments/assets/7c164be9-4656-4f05-97cb-74ad5204e31d)

## Engineering task list, details and map
Components for displaying the engineering task list, details and map that are embedded as an iframe in the [odysseus-mct](https://github.com/OdysseusLarp/odysseus-mct) engineering views.

![Screenshot 2024-07-16 at 09-31-25 Ship faults](https://github.com/user-attachments/assets/5b4f3de7-e97f-4f95-ba30-f3721985d035)

## Power source artifact
View shown on the power source alien artifact phone, used for reading bio IDs (NFC tags) of players, and validating that they have a certain property in order to use the device.

## Starfield
A simple view that shows one of two videos depending on the jump drive state. Used to render a peaceful space view when looking out of the airlock window, and one with a purple tint and effects during a hyperspace jump

## Fighter status
A simple view that displays current Empty Epsilon fighter status.

# Tech

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


