# hlambda-cli [![npm version](https://badge.fury.io/js/hlambda-cli.svg)](https://www.npmjs.com/package/hlambda-cli )

hlambda-cli - CLI tool for managing hlambda server.

[![NPM](https://nodei.co/npm/hlambda-cli.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/hlambda-cli )

## Installation

### npm
```bash
$ npm install -g hlambda-cli
```

## Example

````console
hlambda@pc:~$ hlambda --version
````

````console
hlambda@pc:~$ hlambda init my-first-hlambda-app
````

````console
hlambda@pc:~$ cd my-first-hlambda-app
````
Change the admin_secret in the config.yaml and just run 

````console
hlambda@pc:~$ hlambda metadata apply
````

or run the hlambda metadata apply with option --admin-secret <your_secret>

````console
hlambda@pc:~$ hlambda metadata apply --admin-secret <your_secret>
````

to export existing data from the hlambda server run

````console
hlambda@pc:~$ hlambda metadata export
````

## Reloading metadata

By default metadata apply should also automatically reload the metadata on the server unless `--no-auto-reload` option is set

````console
hlambda@pc:~$ hlambda metadata apply --no-auto-reload
````

to do it manually you can run:

````console
hlambda@pc:~$ hlambda metadata reload
````

## Clearing metadata

If you want to clear all the metadata from the server 

````console
hlambda@pc:~$ hlambda metadata clear
````
