import React, { Component } from 'react';

import PickerDemo from './picker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="app">
        <PickerDemo />
      </div>
    );
  }
}

export default App;
