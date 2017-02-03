# pact-dev-server

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
```pact-dev-server server (start|add)```

- `server add` starts an interactive serverwizard which creates a new serverfile or adds additional servers to it.
  - optional arguments: 
    - `-f ./path-to-serverfile`

- `server start` searches your directory for *.interaction.json files and starts an PACT Mock API Server
  - optional arguments: 
    - `-f | --file ./path-to-serverfile`
    - `-g | --glob **/*.interaction.json` (glob pattern for searching files)
    - `-l | --log-path ./pact-dev-server.log` (path to logfile)
    - `-d | --contract-dir ./pacts` (path for server-written pacts)

### new
```pact-dev-server new INTERACTION_NAME ```
- Starts an step-by-step generator for generating an interactionfile

### config
```pact-dev-server config```
- Starts an step-by-step config generator (brokerserver url + auth)
- Configfile will be stored in your `$HOME` directory (~/.pact-dev-server)

### publish
```pact-dev-server publish PACT_FILE```
- Starts an step-to-step publish generator and publishes a server generated PACT File to a Broker (configurationfile needed)

## TODO
 - Silent mode
