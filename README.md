# hlambda-cli [![npm version](https://badge.fury.io/js/hlambda-cli.svg)](https://www.npmjs.com/package/hlambda-cli )

hlambda-cli - CLI tool for managing Hlambda server.

[![NPM](https://nodei.co/npm/hlambda-cli.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/hlambda-cli )

## Installation

```bash
$ npm install -g hlambda-cli
```

This will add Hlambda CLI to your arsenal, now you can use `hl`, `hla` or `hlambda`.

To check if CLI is working as expected.

````console
$ hl
````

## Installing Hlambda server

You can get the snippet for running Hlambda docker image directly from the CLI

````console
$ hl snippets docker
````

Example output:

```
docker run -d -p 8081:1331 --env HLAMBDA_ADMIN_SECRET=demo --name hlambda-server --restart=always -v hlambda_metadata:/usr/src/app/metadata hlambda/hlambda-core:latest
```

You can even run it directly via additional flag --run

````console
$ hl snip docker --run
````

## Examples

````console
$ hl
````

````console
$ hl --version
````

## Quich start

````console
$ hl init my-app
````

````console
$ cd my-app
````

Change the admin_secret in the config.yaml manually or just run

````console
$ hlambda config save --admin-secret "demo"
````

this will edit the config.yaml file and save admin secret value in that file (please take extra care when commiting config.yaml file to not leak secrets)

You can then export the existing metadata from the running server use

````console
$ hlambda metadata export
````

or you can apply the changes by running

````console
$ hlambda metadata apply
````
or run the hlambda metadata apply with option --admin-secret <your_secret>
which is a prefered option to do this action instead of saving secret it in config.yaml

````console
$ hlambda metadata apply --admin-secret <your_secret>
````

to export existing data from the hlambda server run

````console
$ hlambda metadata export --admin-secret <your_secret>
````

# Env

you can add custom environments and configurations:

````console
$ hl env add dev
````

or delete env configuration

````console
$ hl env delete dev
````

## Reloading metadata

By default metadata apply should also automatically reload the metadata on the server unless `--no-auto-reload` option is set

````console
$ hlambda metadata apply --no-auto-reload
````

to do it manually you can run:

````console
$ hlambda metadata reload
````

## Clearing metadata

If you want to clear all the metadata from the server 

````console
$ hlambda metadata clear
````
