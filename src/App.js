import React from 'react';
import fetch from 'node-fetch';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:3500/book')
      .then(res => res.json())
      .then(response => { console.log(response); this.setState({ list: response }) })
  }

  render() {

    const save = () => {
      fetch('http://localhost:3500/savebook')
        .then( () => {
          fetch('http://localhost:3500/book')
            .then(res => res.json())
            .then(response => { console.log(response); this.setState({ list: response }) })
        })

    }
    const { list } = this.state

    return (
      <div className="App">
        <input type="button" onClick={ save } value="Save" />
        <br />
        {
          list.map(({name}) => <div key={name}>{name}</div>)
        }
      </div>
    );
  }
}

export default App;
