# pact-cli

A CLI Tool to start a API mock server via pact interaction files.  

## Installation
- clone repository
- `npm install`
- `npm run build`
- `npm link`

## Development
`npm run dev`

## Sub-Commands

### server
```pact-cli server (start|add)```

- `server add` starts an interactive serverwizard which creates a new serverfile or adds additional servers to it.
  - optional arguments:
    - `-f ./path-to-serverfile`

- `server start` searches your directory for *.interaction.json files and starts an PACT Mock API Server
  - optional arguments:
    - `-f | --file ./path-to-serverfile`
    - `-l | --log-path ./pact-cli-server.log` (path to logfile)
    - `-c | --contract-dir ./pacts` (path for server-written pacts)
    - `-d | --daemon` if set it will run mockservers in background

### new
```pact-cli new INTERACTION_NAME ```
 - optional arguments:
    - `-f | --file ./path-to-serverfile`
 - Starts an step-by-step generator for creating an interactionfile, a Serverfile *is required*

### config
```pact-cli config```
- Starts an step-by-step config generator (brokerserver url + auth)
- Configfile will be stored in your `$HOME` directory (~/.pact-cli)

### publish
```pact-cli publish PACT_FILE```
  - arguments:
    - `PACTFILE` relative path to JSON file of pact
  - optional arguments:
    - `-v | --version x.x.x` (SEMVER)
    - `-t | --tags tag1,tag2,tag3`
    - `-b | --branch branch-name`
  - will publish the given pact to the configured broker
    - the given branch will be added to the branch list
    - if no version is given it will try to get the version from the pact broker and bump it (minor or build number if prerelase):
      - if no branch is given it fetches from latest,
      - if branch is given it fetches the latest consumer/provider/pact and bumps it's version
      - if branch is given and not master, but tag doesn't yet exists on broker. It get's the tag from master and bumps it to the next prerelase-minor-version.

### verify
```pact-cli verify PACT_FILE```
  - required arguments:
    - `-u | --states-url url` URL to fetch the provider states for the given provider API.
    - `-s | --setup-url url` URL to send PUT requests to setup a given provider state.
    - `-p | --provider-url` Running API provider host endpoint.

# Docker

To run pact-cli within Docker please do the following:

```bash
# build the docker image
docker build -t pact-cli .
# run the docker image
## e.g. start mock servers
## $PATH_TO_INTERACTIONS_DIR = dir with interactions and server files
docker run --rm -v $PATH_TO_INTERACTIONS_DIR:/pact -w /pact pact-cli server start
```

## TODO
 - Silent mode
