import { useState, useEffect } from "react";
import "./App.css";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  price: number;
}

// Mock token data with SVG icons
const tokens: Token[] = [
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

function App() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[2]);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateExchangeRate = () => {
    if (fromToken && toToken) {
      return fromToken.price / toToken.price;
    }
    return 0;
  };

  // Update toAmount when fromAmount or tokens change
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const rate = calculateExchangeRate();
      const result = (Number(fromAmount) * rate).toFixed(6);
      setToAmount(result);
      setError("");
    } else if (fromAmount === "") {
      setToAmount("");
      setError("");
    }
  }, [fromAmount, fromToken, toToken]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

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

      // Check for valid number
      if (value && !isNaN(Number(value)) && Number(value) > 0) {
        setError("");
      } else if (value && Number(value) <= 0) {
        setError("Amount must be greater than 0");
      }
    }
  };

  const handleSwapTokens = () => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromAmount || Number(fromAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (fromToken.symbol === toToken.symbol) {
      setError("Cannot swap the same currency");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert(
        `✅ Swap successful!\n\nYou swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`
      );
      setIsSubmitting(false);

      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  const exchangeRate = calculateExchangeRate();

  return (
    <div className="app">
      <div className="swap-container">
        <form onSubmit={handleSubmit} className="swap-form">
          <h2 className="swap-title">Swap</h2>

          {/* From Section */}
          <div className="input-section">
            <label htmlFor="input-amount" className="input-label">
              Amount to send
            </label>
            <div className="input-wrapper">
              <input
                id="input-amount"
                type="text"
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder="0.0"
                className="amount-input"
                disabled={isSubmitting}
              />
              <select
                value={fromToken.symbol}
                onChange={(e) =>
                  setFromToken(tokens.find((t) => t.symbol === e.target.value)!)
                }
                className="token-select"
                disabled={isSubmitting}
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="token-display">
                <img
                  src={fromToken.icon}
                  alt={fromToken.symbol}
                  className="token-icon"
                />
                <span className="token-symbol">{fromToken.symbol}</span>
              </div>
            </div>
            {fromAmount && (
              <p className="usd-value">
                ≈ $
                {(Number(fromAmount) * fromToken.price).toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}
              </p>
            )}
          </div>

          {/* Swap Button */}
          <div className="swap-icon-container">
            <button
              type="button"
              onClick={handleSwapTokens}
              className={`swap-icon-button ${isLoading ? "rotating" : ""}`}
              disabled={isSubmitting}
              aria-label="Swap currencies"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 14L12 9L7 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* To Section */}
          <div className="input-section">
            <label htmlFor="output-amount" className="input-label">
              Amount to receive
            </label>
            <div className="input-wrapper">
              <input
                id="output-amount"
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="amount-input output-input"
              />
              <select
                value={toToken.symbol}
                onChange={(e) =>
                  setToToken(tokens.find((t) => t.symbol === e.target.value)!)
                }
                className="token-select"
                disabled={isSubmitting}
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="token-display">
                <img
                  src={toToken.icon}
                  alt={toToken.symbol}
                  className="token-icon"
                />
                <span className="token-symbol">{toToken.symbol}</span>
              </div>
            </div>
            {toAmount && (
              <p className="usd-value">
                ≈ $
                {(Number(toAmount) * toToken.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          {/* Exchange Rate Info */}
          {fromAmount && toAmount && !error && (
            <div className="rate-info">
              <p className="rate-text">
                1 {fromToken.symbol} = {exchangeRate.toFixed(6)}{" "}
                {toToken.symbol}
              </p>
              <p className="rate-subtext">
                Rate: ${fromToken.price.toLocaleString()} / $
                {toToken.price.toLocaleString()}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM8 4v5M8 11v1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-button ${isSubmitting ? "loading" : ""}`}
            disabled={!fromAmount || !!error || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              "CONFIRM SWAP"
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="info-footer">
          <p>🔐 Fast Swaps by Linh Nguyen</p>
        </div>
      </div>
    </div>
  );
}

export default App;
