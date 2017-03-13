/*
  Mocked Helper js - add non-mocked functions as required
*/
import {bumpVersion} from './helpers';

export {bumpVersion};

export function getConfig() {
  return {
    brokerUrl: "http://127.0.0.1:5000",
    brokerUser: "",
    brokerPassword: ""
  };
}

export function log(string) {
  // don't log into tests
}
