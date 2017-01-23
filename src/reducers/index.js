import { combineReducers } from 'redux';
import definitions from './definitions';

const appState = combineReducers({
  definitions
});

export default appState;