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

test('submit button renders message when valid email is entered', async () => {
  render(<AppFunctional />);
  const emailInput = screen.getByRole('textbox');
  const submitButton = screen.getByRole('button', {name: /submit/i});

  fireEvent.change(email, { target: { value: 'real@email.com' } })
  fireEvent.click(submitButton);

  const response = await screen.findByText(/real win #26/i);
  expect(response).toBeInTheDocument();
})

test('submit button renders proper messages when invalid email input is provided', async () => {
  render(<AppFunctional />);
    const emailInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', {name: /submit/i});

    fireEvent.change(emailInput, { target: { value: 'fake@email' } })
    fireEvent.click(submitButton);

    const message = await screen.findByText(/Ouch: email must be a valid email/i);
    expect(message).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'foo@bar.baz' } })
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(message).toHaveTextContent(/foo@bar.baz failure #23/i);
    })
    
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(message).toHaveTextContent(/Ouch: email is required/i);
    })
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
