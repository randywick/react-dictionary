import React, { PropTypes } from 'react';
import DefinitionPart from './DefinitionPart.jsx';

const ulStyle = {
  listStyle: 'none',
  paddingLeft: 0
};

function describeDefs(term, definitions, isFetching) {
  if (isFetching) {
    return (
      <div>Fetching...</div>
    )
  }

  if (!term) {
    return (
      <div>Enter a word or phrase above to look up</div>
    )
  }

  if (!definitions || !definitions.length) {
    return (
      <div>No definition found.</div>
    )
  }
}

const Definition = ({ term, definitions, isFetching }) => (
  <div>
    <h1>{term}</h1>
    {describeDefs(term, definitions, isFetching)}
    <ul style={ulStyle}>
      {definitions.map(part =>
        <DefinitionPart
          key={part.key}
          part={part.part}
          values={part.values}
        />
      )}
    </ul>
  </div>
);

export default Definition;