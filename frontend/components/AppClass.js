import React from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

// const initialState = {
//   message: initialMessage,
//   email: initialEmail,
//   index: initialIndex,
//   steps: initialSteps,
// }

const URL = 'http://localhost:9000/api/result';
let x = 2;
let y = 2;

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = {
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
    }
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let coordinates = [];
    if(this.state.index < 3) {
      x = this.state.index + 1;
      y = 1;
    } else if (this.state.index > 5) {
      x = this.state.index - 5;
      y = 3;
    } else {
      x = this.state.index - 2;
      y = 2;
    }
    coordinates[0] = x;
    coordinates[1] = y;
    return coordinates;
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const result = this.getXY();
    return(`Coordinates (${result[0]}, ${result[1]})`);
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({...this.state, 
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex
    })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if(direction === 'left' && this.state.index - 1 >= 0 && x > 1) {
      this.setState({...this.state, 
        index: this.state.index - 1, 
        message: initialMessage, 
        steps: this.state.steps + 1});
    } else if(direction === 'right' && this.state.index + 1 <= 8 && x < 3) {
      this.setState({...this.state, 
        index: this.state.index + 1, 
        message: initialMessage, 
        steps: this.state.steps + 1});
    } else if(direction === 'up' && this.state.index - 3 >= 0 && y > 1) {
      this.setState({...this.state, 
        index: this.state.index - 3, 
        message: initialMessage, 
        steps: this.state.steps + 1});
    } else if(direction === 'down' && this.state.index + 3 <= 8 && y < 3) {
      this.setState({...this.state, 
        index: this.state.index + 3, 
        message: initialMessage, 
        steps: this.state.steps + 1});
    } else {
      this.setState({...this.state, message: `You can't go ${direction}`});
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({...this.state, email: evt.target.value});
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    const newSubmission = {
      x: x,
      y: y, 
      steps: this.state.steps, 
      email: this.state.email 
    }
    console.log(newSubmission);

    axios.post(URL, newSubmission)
      .then(res => {
        this.setState({...this.state, message: res.data.message});
      })
      .catch(err => {
        console.error(err);
        this.setState({...this.state, message: err.response.data.message});
      })
      this.setState({...this.state, email: ''});
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} time{this.state.steps === 1 ? '' : 's'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.getNextIndex('left')}>LEFT</button>
          <button id="up" onClick={() => this.getNextIndex('up')}>UP</button>
          <button id="right" onClick={() => this.getNextIndex('right')}>RIGHT</button>
          <button id="down" onClick={() => this.getNextIndex('down')}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={(evt) => this.onSubmit(evt)}>
          <input
            id="email" 
            type="email" 
            placeholder="type email"
            value={this.state.email}
            onChange={(evt) => this.onChange(evt)}
          >
          </input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
