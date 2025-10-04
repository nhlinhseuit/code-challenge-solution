import { useState, useEffect, useCallback, useMemo } from "react";
import type { Token } from "../types";
import { TokenType } from "../types";
import { tokenApi } from "../services/api";

export const useSwap = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
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
        const response = await tokenApi.fetchTokens();
        if (response.success) {
          setTokens(response.data);
          setFromToken(response.data[0]);
          setToToken(response.data[2]);
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

  const exchangeRate = useMemo(() => {
    if (fromToken && toToken) {
      return fromToken.price / toToken.price;
    }
    return 0;
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const result = (Number(fromAmount) * exchangeRate).toFixed(4);
      setToAmount(result);
      setError("");
    } else if (fromAmount === "") {
      setToAmount("");
      setError("");
    }
  }, [fromAmount, exchangeRate]);

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

  const handleTokenSelection = useCallback((token: Token, type: TokenType) => {
    if (type === TokenType.FROM) {
      setFromToken(token);
    } else {
      setToToken(token);
    }
  }, []);

  return {
    tokens,
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
