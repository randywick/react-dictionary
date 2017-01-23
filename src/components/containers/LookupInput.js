// @flow

import React from 'react';
import { connect } from 'react-redux';
import { fetchDefinition } from '../../actions';

let LookupInput = ({ dispatch }) => {
  let input;

  const formSubmit = e => {
    e.preventDefault();
    if (!input.value.trim()) {
      return;
    }
    dispatch(fetchDefinition(input.value));
    input.select()
  }

  return (
    <form onSubmit={formSubmit}>
      <input
        ref={node => input = node}
      />
      <button type="submit">
        Lookup
      </button>
    </form>
  )
};

LookupInput = connect()(LookupInput);

export default LookupInput;