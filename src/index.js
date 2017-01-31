import path from 'path';
import {die, getParsedArgs, readJSON} from './helpers';
import setupServers, {getInteractionsPromise} from './setupServers';
import glob from 'glob';

const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);
const servers = readJSON(args.file);

getInteractionsPromise(args).then((interactions) => {
  setupServers(args, servers, interactions);
}, (err) =>  { console.log(err) });
