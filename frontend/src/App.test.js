import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza el título de la app', () => {
  render(<App />);
  const title = screen.getByText(/Front React funcionando/i);
  expect(title).toBeInTheDocument();
});
