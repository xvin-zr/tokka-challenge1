import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { render } from './utilities';
// import '@testing-library/jest-dom';
import Form from '@/components/form';
import { screen } from '@testing-library/react';

describe('Form component', () => {
  const queryClient = new QueryClient();
  it('should render component', () => {
    const setHash = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Form setHash={setHash} />
      </QueryClientProvider>,
    );

    // check if the Txn Hash input renders correctly
    expect(screen.getByLabelText(/Txn Hash/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Your Hash 0x with 64 characters/i),
    ).toBeInTheDocument();

    // check if the Page Size input renders correctly
    expect(screen.getByLabelText(/Page Size/i)).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /Page Size/i }),
    ).toBeInTheDocument();
  });
});
