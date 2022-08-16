# Release 0.0.13

- Ability to create new template files, for creating new routes by the best practices
- Add support for entry point files, that do not export default router.
- Ability to set default environment, useful for local development when running commands. (This is not the same as the default that you can set in config.yaml, this can be env specific, thus .env should contain that info)
- Update docs
- Fix security issues via npm audit
- Ability to run server metadata reset
- Clone command

# Release 0.0.12

- Bugfixes
- General improvements

# Release 0.0.11

- Bugfix for Node LTS version, ERR_UNKNOWN_BUILTIN_MODULE
- Update github actions & npm publish
- Improve init template, add .gitignore, .env
- Improve creation of the env variables for new environments

# Release 0.0.10

- Tests
- Shell command execution

# Release 0.0.9

- Environments, and env management
- Override values from YAML from .env using {{}} pattern
- Snippets, used for quick installation
- ~~ Analytics~~ Replaced with feedback program (We believe in privacy by default)
- Optimize node_modules deployment, such that we can deploy the app without zip-ing dependencies
- Check for new versions and updates
- Shell command execution on metadata apply as post apply script

# Release 0.0.8

- New initialization template
- Init command flags, force, and force-remove
- Add new command aliases
- Add changelog
- Fix the issue with passing -c flag to the save
- Colorize the output
- No color output flag --no-color
- Handle request connection error
- Add aliases
