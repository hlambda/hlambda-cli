# hlambda-cli [![npm version](https://badge.fury.io/js/hlambda-cli.svg)](https://www.npmjs.com/package/hlambda-cli )

hlambda-cli - Library containing functions and helpers used in hlambda-cli apps.

[![NPM](https://nodei.co/npm/hlambda-cli.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/hlambda-cli )

## Installation

### npm
```bash
$ npm i hlambda-cli --save
```

### yarn
```bash
$ yarn add hlambda-cli
```

## Example

````shell
$ hlambda version
$ hlambda --version
````

````shell
$ hlambda init my-first-hlambda-app
````

````shell
$ cd my-first-hlambda-app
````
Change the admin_secret in the config.yaml and just run 

````shell
$ hlambda metadata apply
````

or run the hlambda console with option --admin-secret <your_secret>

````shell
$ hlambda metadata apply --admin-secret <your_secret>
````

to export existing data from the hlambda server run

````shell
$ hlambda metadata export
````

## Notice

```
This CLI is still in development. Main functionality may be missing, any contributions are greatly appreciated.
```