import React, { PropTypes } from 'react';
import marked from 'react-marked';

function parseValue(value) {
  const markup = marked(value)
  console.log(markup)

  return value
}

const DefinitionPart = ({ part, values }) => (
  <li>
    <div>
      <h5>{part}</h5>
      <ul>
        {values.map(item => <li key={item.key.toString()}>{parseValue(item.value)}</li>)}
      </ul>
    </div>
  </li>
)

export default DefinitionPart;