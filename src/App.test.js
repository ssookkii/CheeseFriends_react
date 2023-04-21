import { render, screen } from '@testing-library/react';
import App from './App_psj';
//merge 테스트
//test//
//test// 소영님 화이팅,,,,
//vscode
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

