import { useState, useEffect, useCallback, useMemo } from "react";
import type { Token } from "../types";
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

  // Fetch tokens on mount
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

  // Calculate exchange rate with useMemo for optimization
  const exchangeRate = useMemo(() => {
    if (fromToken && toToken) {
      return fromToken.price / toToken.price;
    }
    return 0;
  }, [fromToken, toToken]);

  // Update toAmount when fromAmount or tokens change
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const result = (Number(fromAmount) * exchangeRate).toFixed(6);
      setToAmount(result);
      setError("");
    } else if (fromAmount === "") {
      setToAmount("");
      setError("");
    }
  }, [fromAmount, exchangeRate]);

  // Validate amount input with useCallback
  const validateAmount = useCallback((value: string): string => {
    // Allow empty string
    if (value === "") {
      return "";
    }

    // Validate number input - only allow positive numbers with decimal
    if (!/^\d*\.?\d*$/.test(value)) {
      return "Only numbers and decimal point allowed";
    }

    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      return "Amount must be greater than 0";
    }

    return "";
  }, []);

  // Handle amount change with useCallback
  const handleFromAmountChange = useCallback(
    (value: string) => {
      // Allow empty string
      if (value === "") {
        setFromAmount("");
        setToAmount("");
        setError("");
        return;
      }

      // Validate number input
      if (/^\d*\.?\d*$/.test(value)) {
        setFromAmount(value);

        const validationError = validateAmount(value);
        setError(validationError);
      }
    },
    [validateAmount]
  );

  // Handle token swap with useCallback
  const handleSwapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;

    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      const tempToken = fromToken;

      setFromToken(toToken);
      setToToken(tempToken);
      setFromAmount(toAmount);

      // Recalculate based on swapped tokens
      if (toAmount && !isNaN(Number(toAmount))) {
        const rate = toToken.price / tempToken.price;
        const result = (Number(toAmount) * rate).toFixed(6);
        setFromAmount(toAmount);
        setToAmount(result);
      }

      setIsLoading(false);
    }, 300);
  }, [fromToken, toToken, toAmount]);

  // Handle form submission with useCallback
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
        // Execute swap via API
        const response = await tokenApi.executeSwap(
          fromToken.symbol,
          toToken.symbol,
          Number(fromAmount)
        );

        if (response.success) {
          alert(
            `✅ Swap successful!\n\nYou swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}\nTransaction: ${response.data.txHash}`
          );

          // Reset form
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

  // Handle token selection with useCallback
  const handleTokenSelection = useCallback(
    (token: Token, type: "from" | "to") => {
      if (type === "from") {
        setFromToken(token);
      } else {
        setToToken(token);
      }
    },
    []
  );

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
