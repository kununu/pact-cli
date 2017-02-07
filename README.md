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
    - `-d | --contract-dir ./pacts` (path for server-written pacts)

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
- Starts an step-to-step publish generator and publishes a server generated PACT File to a Broker (configurationfile needed)

## TODO
 - Silent mode
