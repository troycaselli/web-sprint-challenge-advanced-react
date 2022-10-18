import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from './AppFunctional';

test('sanity', () => {
  expect(true).toBe(true)
})

test('function renders', () => {
  render(<AppFunctional />);

})

test('coordinates reflect the location of the active square', () => {
  render(<AppFunctional />);

  const up = screen.getByText(/up/i);
  const right = screen.getByText(/right/i);
  const down = screen.getByText(/down/i);
  const left = screen.getByText(/left/i);
  const reset = screen.getByText(/reset/i);
  const coordinates = screen.getByText(/Coordinates/i);

  fireEvent.click(up);
  fireEvent.click(right);

  expect(coordinates).toHaveTextContent('(3, 1)');
  fireEvent.click(reset);
  fireEvent.click(down);
  fireEvent.click(left);
  expect(coordinates).toHaveTextContent('(1, 3)');

})

test('B moves in the grid when navigation buttons are clicked', () => {
  render(<AppFunctional />);

  const up = screen.getByText(/up/i);
  const left = screen.getByText(/left/i);
  const reset = screen.getByText(/reset/i);  
  const defaultActive = screen.getByText('B');

  fireEvent.click(up);
  expect(defaultActive).not.toHaveTextContent('B');

  fireEvent.click(reset);
  expect(defaultActive).toHaveTextContent('B');

  fireEvent.click(left);
  expect(defaultActive).not.toHaveTextContent('B');
})

test('reset button causes no message to show', async () => {
  render(<AppFunctional />);
  const up = screen.getByText(/up/i);
  const reset = screen.getByText(/reset/i);

  fireEvent.click(up);
  fireEvent.click(up);

  const message = await screen.findByText(/You can't go up/i);
  expect(message).toBeInTheDocument();

  fireEvent.click(reset);
  expect(message).toHaveTextContent('');
})

test('move counter renders as expected when box navigation buttons are clicked', () => {
  render(<AppFunctional />);
  const up = screen.getByText(/up/i);
  const right = screen.getByText(/right/i);
  const down = screen.getByText(/down/i);
  const left = screen.getByText(/left/i);
  const reset = screen.getByText(/reset/i);
  const counter = screen.getByText(/You moved 0 times/i);

  expect(counter).toHaveTextContent(/You moved 0 times/i);
  fireEvent.click(up);
  fireEvent.click(up);
  expect(counter).toHaveTextContent(/You moved 1 time/i);
  fireEvent.click(right);
  fireEvent.click(down);
  fireEvent.click(left);
  fireEvent.click(left);
  expect(counter).toHaveTextContent(/You moved 5 times/i);

  fireEvent.click(reset);
  expect(counter).toHaveTextContent(/You moved 0 times/i);
})
