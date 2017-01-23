import React from 'react';
import LookupInput from './containers/LookupInput';
import Definition from './containers/DefinitionContainer';

const App = () => (
  <div style={{height: '100vh', position: 'relative'}}>
    <LookupInput />
    <Definition />
  </div>
);

export default App;