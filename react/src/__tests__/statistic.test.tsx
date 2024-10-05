// Statistic.test.jsx
import fetchRealtimeETHUSDT from '@/api/fetch-realtime-eth-usdt';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import '@testing-library/jest-dom';
import Statistic from '../components/statistic';

// Mock the fetchRealtimeETHUSDT function
vi.mock('@/api/fetch-realtime-eth-usdt');

describe('Statistic Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Instantiate a new QueryClient before each test
    queryClient = new QueryClient();
  });

  afterEach(() => {
    // Clear all mocks after each test
    vi.clearAllMocks();
  });

  it('should render with given fees and display mocked price', async () => {
    // Mock the fetchRealtimeETHUSDT to return a fixed price
    (fetchRealtimeETHUSDT as Mock).mockResolvedValue(2000); // Mocked price

    render(
      <QueryClientProvider client={queryClient}>
        <Statistic totalETH={100} totalUSDT={100} />
      </QueryClientProvider>,
    );

    // Verify that Total USDT Fee is displayed correctly
    expect(screen.getByText('Total USDT Fee')).toBeInTheDocument();
    expect(screen.getByText('100.00')).toBeInTheDocument();

    // Verify that Total ETH Fee is displayed correctly
    expect(screen.getByText('Total ETH Fee')).toBeInTheDocument();
    expect(screen.getByText('100.0000')).toBeInTheDocument();

    // Wait for the price to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Realtime ETH/USDT')).toBeInTheDocument();
      expect(screen.getByText('2000')).toBeInTheDocument();
    });
  });
});
