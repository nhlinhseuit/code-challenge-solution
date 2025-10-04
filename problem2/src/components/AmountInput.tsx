import React, { memo } from "react";
import type { Token } from "../types";

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  token: Token;
  tokens: Token[];
  onTokenChange: (token: Token) => void;
  disabled?: boolean;
  readonly?: boolean;
  label: string;
  placeholder?: string;
}

export const AmountInput: React.FC<AmountInputProps> = memo(
  ({
    amount,
    onAmountChange,
    token,
    tokens,
    onTokenChange,
    disabled = false,
    readonly = false,
    label,
    placeholder = "0.0",
  }) => {
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onAmountChange(e.target.value);
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedToken = tokens.find((t) => t.symbol === e.target.value);
      if (selectedToken) {
        onTokenChange(selectedToken);
      }
    };

    const usdValue =
      amount && !isNaN(Number(amount))
        ? (Number(amount) * token.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : null;

    return (
      <div className="input-section">
        <label htmlFor={`amount-${token.symbol}`} className="input-label">
          {label}
        </label>
        <div className="input-wrapper">
          <input
            id={`amount-${token.symbol}`}
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={placeholder}
            className={`amount-input ${readonly ? "output-input" : ""}`}
            disabled={disabled || readonly}
            readOnly={readonly}
          />
          <select
            value={token.symbol}
            onChange={handleTokenChange}
            className="token-select"
            disabled={disabled}
          >
            {tokens.map((t) => (
              <option key={t.symbol} value={t.symbol}>
                {t.symbol}
              </option>
            ))}
          </select>
          <div className="token-display">
            <img src={token.icon} alt={token.symbol} className="token-icon" />
            <span className="token-symbol">{token.symbol}</span>
          </div>
        </div>
        {usdValue && <p className="usd-value">≈ ${usdValue}</p>}
      </div>
    );
  }
);

AmountInput.displayName = "AmountInput";
