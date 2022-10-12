import React, {useState, useEffect} from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const URL = 'http://localhost:9000/api/result';
let moveCount = 0;

export default function AppFunctional(props) {
  let x, y = null;

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let coordinates = {x: null, y: null};
    if(index < 3) {
      x = index + 1;
      y = 1;
    } else if (index > 5) {
      x = index - 5;
      y = 3;
    } else {
      x = index - 2;
      y = 2;
    }
    coordinates[0] = x;
    coordinates[1] = y;
    return coordinates;
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage` returns the fully constructed string.
    const result = getXY();
    return(`Coordinates (${result[0]}, ${result[1]})`);
  }

  useEffect(() => {
    getXYMessage();
  }, [index]);

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index of the "B" would be. If the move is impossible because we are at the edge of the grid, this helper should return the current index unchanged.
    if(direction === 'left' && index - 1 >= 0 && x > 1) {
      move();
      return setIndex(index - 1);
    } else if(direction === 'right' && index + 1 <= 8 && x < 3) {
      move();
      return setIndex(index + 1);
    } else if(direction === 'up' && index - 3 >= 0 && y > 1) {
      move();
      return setIndex(index - 3);
    } else if(direction === 'down' && index + 3 <= 8 && y < 3) {
      move();
      return setIndex(index + 3);
    } else {
      return setMessage(`You can't go ${direction}`);
    }
  }

  function move() {
    // This event handler can use the helper above to obtain a new index for the "B", and change any states accordingly.
    setMessage(initialMessage);
    moveCount++;
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const newSubmission = { 
      "x": 1, 
      "y": 2, 
      "steps": 3, 
      "email": email }

    axios.post(URL, newSubmission)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
    setEmail('');
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {moveCount} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex('left')} >LEFT</button>
        <button id="up" onClick={() => getNextIndex('up')}>UP</button>
        <button id="right" onClick={() => getNextIndex('right')}>RIGHT</button>
        <button id="down" onClick={() => getNextIndex('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={(evt) => onSubmit(evt)}>
        <input 
          id="email" 
          type="email"
          placeholder="type email" 
          value={email} 
          onChange={(evt) => onChange(evt)}>
        </input>
        <input 
          id="submit" 
          type="submit">
        </input>
      </form>
    </div>
  )
}
