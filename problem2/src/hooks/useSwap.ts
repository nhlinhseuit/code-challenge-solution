import { useState, useEffect, useCallback, useMemo } from "react";
import type { Token } from "../types";
import { TokenType } from "../types";
import { tokenApi } from "../services/api";

export const useSwap = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokensLoading, setTokensLoading] = useState(true);

  const isValidNumberFormat = (value: string): boolean => {
    return /^\d*\.?\d*$/.test(value);
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setTokensLoading(true);

        const [response] = await Promise.all([tokenApi.fetchTokens()]);

        if (response.success) {
          setTokens(response.data);

          const mockUserTokenBalances: Record<string, number> = {
            BLUR: 125.5,
            bNEO: 45.25,
            BUSD: 1000.0,
            USD: 5000.0,
            ETH: 2.5,
            GMX: 10.75,
            STEVMOS: 500.0,
            LUNA: 150.3,
            RATOM: 75.0,
            STRD: 200.0,
            EVMOS: 300.5,
            IBCX: 50.0,
            IRIS: 100.0,
          };

          const mockUserTokenSymbols = Object.keys(mockUserTokenBalances);
          const mockUserTokens = response.data
            .filter((token) => mockUserTokenSymbols.includes(token.symbol))
            .map((token) => ({
              ...token,
              balance: mockUserTokenBalances[token.symbol],
            }));

          setUserTokens(mockUserTokens);
        } else {
          setError("Failed to load tokens");
        }
      } catch (err) {
        setError("Failed to load tokens");
      } finally {
        setTokensLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const availableFromTokens = useMemo(() => {
    return userTokens;
  }, [userTokens]);

  const availableToTokens = useMemo(() => {
    if (!fromToken) return userTokens;
    return userTokens.filter((token) => token.symbol !== fromToken.symbol);
  }, [userTokens, fromToken]);

  const exchangeRate = useMemo(() => {
    if (fromToken && toToken) {
      return fromToken.price / toToken.price;
    }
    return 0;
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const amount = Number(fromAmount);

      if (
        fromToken &&
        fromToken.balance !== undefined &&
        amount > fromToken.balance
      ) {
        setError(
          `Insufficient balance. Maximum: ${fromToken.balance.toLocaleString()} ${
            fromToken.symbol
          }`
        );
        setToAmount("");
        return;
      }

      const result = (amount * exchangeRate).toFixed(4);
      setToAmount(result);
      setError("");
    } else if (fromAmount === "") {
      setToAmount("");
      setError("");
    }
  }, [fromAmount, exchangeRate, fromToken]);

  const handleFromAmountChange = useCallback((value: string) => {
    if (value === "") {
      setFromAmount("");
      setToAmount("");
      setError("");
      return;
    }

    if (isValidNumberFormat(value)) {
      setFromAmount(value);
    }
  }, []);

  const handleSwapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;

    setIsLoading(true);

    setTimeout(() => {
      const tempToken = fromToken;

      setFromToken(toToken);
      setToToken(tempToken);
      setFromAmount(toAmount);

      if (toAmount && !isNaN(Number(toAmount))) {
        const rate = toToken.price / tempToken.price;
        const result = (Number(toAmount) * rate).toFixed(4);
        setFromAmount(toAmount);
        setToAmount(result);
      }

      setIsLoading(false);
    }, 300);
  }, [fromToken, toToken, toAmount]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!fromToken || !toToken || !fromAmount || Number(fromAmount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      if (fromToken.symbol === toToken.symbol) {
        setError("Cannot swap the same currency");
        return;
      }

      setError("");
      setIsSubmitting(true);

      try {
        const response = await tokenApi.executeSwap(
          fromToken.symbol,
          toToken.symbol,
          Number(fromAmount)
        );

        if (response.success) {
          alert(
            `Swap successful!\n\nYou swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}\nTransaction: ${response.data.txHash}`
          );

          setFromAmount("");
          setToAmount("");
        } else {
          setError(response.error || "Swap failed");
        }
      } catch (err) {
        setError("Swap failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fromToken, toToken, fromAmount, toAmount]
  );

  const handleTokenSelection = useCallback(
    (token: Token, type: TokenType) => {
      if (type === TokenType.FROM) {
        setFromToken(token);
        if (toToken && token.symbol === toToken.symbol) {
          setToToken(null);
        }
      } else {
        setToToken(token);
      }
    },
    [toToken]
  );

  return {
    tokens,
    userTokens,
    availableFromTokens,
    availableToTokens,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    exchangeRate,
    isLoading,
    error,
    isSubmitting,
    tokensLoading,
    handleFromAmountChange,
    handleSwapTokens,
    handleSubmit,
    handleTokenSelection,
  };
};
