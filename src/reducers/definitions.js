
import { REQUEST_DEFINITION, RECEIVE_DEFINITION } from '../actions';


function definition(state = { isFetching: false, result: [] }, action) {
  switch (action.type) {
    case REQUEST_DEFINITION:
      return Object.assign({}, state, {
        term: action.payload.term,
        isFetching: true
      })

    case RECEIVE_DEFINITION:
      console.log('at receive definition reducer', {state, action})
      return Object.assign({}, state, {
        isFetching: false,
        definitions: action.payload.definitions,
        lastUpdated: action.payload.receivedAt
      })

    default:
      return state
  }
}

function definitions(state = {}, action)  {
  switch (action.type) {
    case RECEIVE_DEFINITION:
    case REQUEST_DEFINITION:
      return Object.assign({}, state, {
        term: action.payload.term,
        [action.payload.term]: definition(state[action.payload.term], action)
      });

    default:
      return state;
  }
};

export default definitions;