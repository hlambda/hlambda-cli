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
- Override values from yaml from .env using {{}} pattern
- Snippets, used for quick installation
- ~~ Analytics~~ Replaced with feedback program (We belive in privacy by default)
- Optimize node_modules deployment, such that we can deploy app without zip-ing dependencies
- Check for new version and updates
- Shell command execution on metadata apply as post apply script

# Release 0.0.8

- New initialization template
- Init command flags, force and force-remove
- Add new command aliases
- Add changelog
- Fix the issue with passing -c flag to the save
- Colorize the output
- No color output flag --no-color
- Handle request connection error
- Add aliases
