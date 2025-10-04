import type { Token, ApiResponse } from "../types";

const TOKEN_API_URL = "https://interview.switcheo.com/prices.json";

export const tokenApi = {
  async fetchTokens(): Promise<ApiResponse<Token[]>> {
    try {
      const response = await fetch(TOKEN_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceData = await response.json();

      const tokenMap = new Map<string, { price: number; date: string }>();

      priceData.forEach(
        (item: { currency: string; price: number; date: string }) => {
          if (
            !tokenMap.has(item.currency) ||
            new Date(item.date) > new Date(tokenMap.get(item.currency)!.date)
          ) {
            tokenMap.set(item.currency, { price: item.price, date: item.date });
          }
        }
      );

      const getLocalIconPath = (symbol: string): string => {
        return `/src/assets/${symbol}.svg`;
      };

      const tokens: Token[] = [];
      tokenMap.forEach((data, symbol) => {
        if (data.price && data.price > 0) {
          tokens.push({
            symbol,
            name: symbol,
            icon: getLocalIconPath(symbol),
            price: data.price,
          });
        }
      });

      return {
        data: tokens,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching tokens:", error);
      return {
        data: [],
        success: false,
        error: "Failed to fetch token prices",
      };
    }
  },

  async fetchTokenPrice(symbol: string): Promise<ApiResponse<number>> {
    try {
      const response = await fetch(TOKEN_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceData = await response.json();

      let latestPrice = 0;
      let latestDate = "";

      priceData.forEach(
        (item: { currency: string; price: number; date: string }) => {
          if (item.currency === symbol) {
            if (!latestDate || new Date(item.date) > new Date(latestDate)) {
              latestPrice = item.price;
              latestDate = item.date;
            }
          }
        }
      );

      if (latestPrice === 0) {
        return {
          data: 0,
          success: false,
          error: `Token ${symbol} not found`,
        };
      }

      return {
        data: latestPrice,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching token price:", error);
      return {
        data: 0,
        success: false,
        error: "Failed to fetch token price",
      };
    }
  },

  async executeSwap(
    fromToken: string,
    toToken: string,
    amount: number
  ): Promise<ApiResponse<{ txHash: string }>> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.error("Swapped tokens:", fromToken, toToken, amount);

    return {
      data: {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      },
      success: true,
    };
  },
};
