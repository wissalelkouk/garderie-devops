import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

test('affiche le titre Ma Garderie', () => {
  render(<Navbar />);
  expect(screen.getByText('Ma Garderie')).toBeTruthy();
});