# pact-dev-server

A CLI Tool to start a API mock server via pact interaction files.  
Awaits a `servers.json` file at the current working directory (or given file via --file parameter)  
Searches for `**/*.interaction.json` glob by default (or given pattern via --glob-pattern)  

## Servers File Structure
```
[
  {
    "consumer": "frontend",
    "provider": "backend",
    "port": 8888,
    "spec": 3
  }
]
```

## Arguments
```
-h, --help            Show this help message and exit.
-v, --version         Show program's version number and exit.
-n NEW, --new         Interaction File Wizard
-f FILE, --file FILE  Start server with Serverfile (default: ./servers.json)

-p GLOB_PATTERN, --glob-pattern GLOB_PATTERN
                      Set the glob pattern for pact files (default: **/*.interaction.json

-d CONTRACT_DIR, --contract-dir CONTRACT_DIR
                      Set the Contracts directory (default: ./pacts)

-l LOG_PATH, --log-path LOG_PATH
                      Set the logpath (default: ./pact-dev-server.log)
```

## Installation 
- clone repository
- `npm install`
- `npm run build`
- `npm link`

## TODO
 - Silent mode
 - "--start-after" parameter (for JEST)
