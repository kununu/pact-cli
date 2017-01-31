import {die, getParsedArgs, readJSON} from './helpers.js';
import path from 'path';
const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);
