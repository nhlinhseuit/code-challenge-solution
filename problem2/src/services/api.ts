import type { Token, ApiResponse } from "../types";

// Mock API service for fetching token data
export const tokenApi = {
  async fetchTokens(): Promise<ApiResponse<Token[]>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data - in real app, this would be an actual API call
    const mockTokens: Token[] = [
      {
        symbol: "ETH",
        name: "Ethereum",
        icon: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/eth.svg",
        price: 2500.0,
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        icon: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/btc.svg",
        price: 45000.0,
      },
      {
        symbol: "USDT",
        name: "Tether",
        icon: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/usdt.svg",
        price: 1.0,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        icon: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/usdc.svg",
        price: 1.0,
      },
      {
        symbol: "BNB",
        name: "Binance Coin",
        icon: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/bnb.svg",
        price: 320.0,
      },
      {
        symbol: "SOL",
        name: "Solana",
        icon: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/sol.svg",
        price: 150.0,
      },
    ];

    return {
      data: mockTokens,
      success: true,
    };
  },

  async fetchTokenPrice(symbol: string): Promise<ApiResponse<number>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock price data - in real app, this would fetch current market price
    const mockPrices: Record<string, number> = {
      ETH: 2500.0,
      BTC: 45000.0,
      USDT: 1.0,
      USDC: 1.0,
      BNB: 320.0,
      SOL: 150.0,
    };

    const price = mockPrices[symbol];
    if (price === undefined) {
      return {
        data: 0,
        success: false,
        error: `Token ${symbol} not found`,
      };
    }

    return {
      data: price,
      success: true,
    };
  },

  async executeSwap(
    fromToken: string,
    toToken: string,
    amount: number
  ): Promise<ApiResponse<{ txHash: string }>> {
    // Simulate API delay for swap execution
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock successful swap
    return {
      data: {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      },
      success: true,
    };
  },
};
