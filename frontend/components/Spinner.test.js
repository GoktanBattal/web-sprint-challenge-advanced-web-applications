// Import the Spinner component into this file and test
import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

// that it renders what it should for the different props it can take.
test('sanity', () => {
  const { getByText, queryByText, rerender } = render(<Spinner on={true} />);
  const waitText = getByText(/Please wait.../i);
  expect(waitText).toBeTruthy();
  rerender(<Spinner on={false} />);
  expect(queryByText(/Please wait.../i)).toBeNull;
});
