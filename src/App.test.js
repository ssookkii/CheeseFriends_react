import { render, screen } from '@testing-library/react';
import App from './App';
//merge 테스트
//test//
//test//
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

