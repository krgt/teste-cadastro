import React from 'react';

import Table from './components/Table/Table'

const style = {
  height: "100vh",
  maxHeight: "100vh"
}

export default () => {
  return (
    <main style={style}>
      <Table />
    </main>
  );
}