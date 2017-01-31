import path from 'path';
import {die, getParsedArgs, readJSON} from './helpers';
import setupServers from './setupServers';
const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);
const servers = readJSON(args.file);

setupServers(args, servers);


