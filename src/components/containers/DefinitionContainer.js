

import { connect } from 'react-redux';
import Definition from '../Definition.jsx';

function mapStateToProps(state) {
  console.log('mapping state to props', state)

  const term = state.definitions.term;
  const result = state.definitions[term] || {};
  const isFetching = !!result.isFetching;
  const definitions = (result.definitions || []).map(part => {
    part.key = part.part
    return part;
  })

  return {
    term,
    definitions,
    isFetching
  };
};

const DefinitionContainer = connect(mapStateToProps)(Definition);

export default DefinitionContainer;