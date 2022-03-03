# hlambda-cli [![npm version](https://badge.fury.io/js/hlambda-cli.svg)](https://www.npmjs.com/package/hlambda-cli )

hlambda-cli - CLI tool for managing Hlambda server.

[![NPM](https://nodei.co/npm/hlambda-cli.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/hlambda-cli )

## 🧰 Install Hlambda CLI

```bash
$ npm install -g hlambda-cli
```

This will add Hlambda CLI to your arsenal, now you can use `hl`, `hla` or `hlambda`.

## 📚 Using Hlambda CLI

Check if the console is installed globally, in your terminal you can now run

````console
$ hl
````

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

## 🧙🏻‍♂️ Quich start

Initialize new configuration in the new folder `test`

````console
$ hl i test
````

change working directory to `test`

````console
$ cd test
````

Change the admin_secret in the config.yaml manually or just run

````console
$ hlambda config save --admin-secret "demo"
````

this will edit the config.yaml file and save admin secret value in that file (**🧨 please take extra care when commiting `config.yaml` file to not leak secrets**
**, check Environments section for more details but we suggest you to use `env replacer syntax` like `{{ENV_HLAMBDA_ADMIN_SECRET}}` and keeping your secrets in the environemnt variables**)

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

## 📦 Environments

If you have multiple deployments of the same app you can now add environments to your hlambda config using `hlambda-cli`

To add `dev` environment use

````console
$ hl env add dev
````

this will add new `dev` folder environment in `./environments/dev` with `config.yaml`

example content of the `./environments/dev/config.yaml`

```
version: 1
endpoint: "{{ENV_DEV_HLAMBDA_ENDPOINT}}"
admin_secret: "{{ENV_DEV_HLAMBDA_ADMIN_SECRET}}"
```

this will be used instead of the values in root `config.yaml` file.

🧨 Important! - You can hardcode but it is the best practice to use `env replacer syntax` `{{ENV_DEV_HLAMBDA_ADMIN_SECRET}}` the value will be the one provided in the `ENV_DEV_HLAMBDA_ADMIN_SECRET` environment variable at the CLI command run-time.

✨ Hlambda cli also supports .env file 😄 
so you can create `.env` file in the root
```
ENV_DEV_HLAMBDA_ENDPOINT="http://localhost:8081"
ENV_DEV_HLAMBDA_ADMIN_SECRET="demo"
```

Any hlambda CLI command can now be excuted for different environment, example

````console
$ hl server logs --env dev
````

````console
$ hl metadata apply --env dev
````

to add `custom_name` environemnt use

````console
$ hl env add custom_name
````

to delete environment named "staging"

````console
$ hl env delete staging
````

this will remove the whole environment folder.
