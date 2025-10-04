# React Optimization Documentation

## Overview

This document explains the use of `useCallback`, `useMemo`, and input validation optimizations implemented in the swap application.

## useCallback Usage

### 1. `validateAmount` in `useSwap.ts` (Line 62-75)

```typescript
const validateAmount = useCallback((value: string): string => {
  // Validation logic
}, []);
```

**Why useCallback here:**

- **Prevents unnecessary re-renders**: Without `useCallback`, this function would be recreated on every render
- **Stable reference**: Child components that depend on this function won't re-render unnecessarily
- **Empty dependency array**: The function doesn't depend on any external values, so it only needs to be created once

### 2. `handleFromAmountChange` in `useSwap.ts` (Line 78-92)

```typescript
const handleFromAmountChange = useCallback(
  (value: string) => {
    // Handle amount change logic
  },
  [validateAmount]
);
```

**Why useCallback here:**

- **Depends on validateAmount**: Since it uses `validateAmount`, it needs to be recreated when `validateAmount` changes
- **Event handler optimization**: Prevents the input component from re-rendering when other state changes
- **Performance**: Reduces unnecessary re-renders of the AmountInput component

### 3. `handleSwapTokens` in `useSwap.ts` (Line 95-115)

```typescript
const handleSwapTokens = useCallback(() => {
  // Swap logic
}, [fromToken, toToken, toAmount]);
```

**Why useCallback here:**

- **Complex dependencies**: Depends on `fromToken`, `toToken`, and `toAmount`
- **Swap button optimization**: Prevents the SwapButton component from re-rendering unnecessarily
- **State updates**: Only recreates when the dependent tokens or amount change

### 4. `handleSubmit` in `useSwap.ts` (Line 118-155)

```typescript
const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    // Submit logic
  },
  [fromToken, toToken, fromAmount, toAmount]
);
```

**Why useCallback here:**

- **Form submission**: Critical for preventing unnecessary re-renders of the SubmitButton
- **API calls**: Expensive operation that should only recreate when necessary
- **Dependencies**: Only recreates when form data changes

### 5. `handleTokenSelection` in `useSwap.ts` (Line 158-164)

```typescript
const handleTokenSelection = useCallback(
  (token: Token, type: "from" | "to") => {
    // Token selection logic
  },
  []
);
```

**Why useCallback here:**

- **Generic handler**: Used by multiple token selectors
- **Stable reference**: No dependencies, so it's created once and reused
- **Performance**: Prevents re-renders of token selector components

## useMemo Usage

### 1. `exchangeRate` in `useSwap.ts` (Line 49-54)

```typescript
const exchangeRate = useMemo(() => {
  if (fromToken && toToken) {
    return fromToken.price / toToken.price;
  }
  return 0;
}, [fromToken, toToken]);
```

**Why useMemo here:**

- **Expensive calculation**: Division operation that should only run when tokens change
- **Prevents unnecessary calculations**: Without `useMemo`, this would calculate on every render
- **Dependency optimization**: Only recalculates when `fromToken` or `toToken` changes
- **Performance**: Critical for responsive UI, especially with frequent state updates

## Component Memoization

### 1. All Components use `React.memo`

```typescript
export const AmountInput: React.FC<AmountInputProps> = memo(({ ... }) => {
  // Component logic
});
```

**Why React.memo:**

- **Prevents unnecessary re-renders**: Components only re-render when their props actually change
- **Shallow comparison**: React.memo performs shallow comparison of props
- **Performance optimization**: Reduces render cycles in the component tree
- **Works with useCallback**: Combined with useCallback, creates optimal re-render behavior

## Input Validation Logic

### Why Only Numbers Are Allowed

#### 1. **Regex Pattern**: `/^\d*\.?\d*$/`

```typescript
if (!/^\d*\.?\d*$/.test(value)) {
  return "Only numbers and decimal point allowed";
}
```

**Explanation:**

- `^\d*` - Start of string, followed by zero or more digits
- `\.?` - Optional decimal point (escaped because `.` is special in regex)
- `\d*$` - Zero or more digits followed by end of string
- **Result**: Only allows positive numbers with optional decimal places

#### 2. **Why No Negative Numbers**

```typescript
const numValue = Number(value);
if (isNaN(numValue) || numValue <= 0) {
  return "Amount must be greater than 0";
}
```

**Business Logic Reasons:**

- **Cryptocurrency swaps**: You can't swap negative amounts
- **Real-world constraints**: Physical assets can't have negative quantities
- **User experience**: Prevents confusion and accidental negative inputs
- **API compatibility**: Most trading APIs don't accept negative amounts

#### 3. **Why No Strings/Letters**

```typescript
if (!/^\d*\.?\d*$/.test(value)) {
  return "Only numbers and decimal point allowed";
}
```

**Technical Reasons:**

- **Type safety**: Amounts must be numeric for calculations
- **API requirements**: Exchange APIs expect numeric values
- **Calculation errors**: Non-numeric input would break exchange rate calculations
- **User experience**: Clear feedback on what's acceptable input

#### 4. **Decimal Point Handling**

- **Single decimal**: Regex allows only one decimal point
- **Precision**: Supports up to 6 decimal places in calculations
- **Real-world usage**: Cryptocurrencies often have high precision requirements

## Performance Benefits

### Before Optimization:

- Functions recreated on every render
- Components re-rendered unnecessarily
- Exchange rate calculated on every render
- Poor performance with frequent state updates

### After Optimization:

- Functions only recreated when dependencies change
- Components only re-render when props change
- Exchange rate only calculated when tokens change
- Smooth performance even with rapid user input

## Best Practices Demonstrated

1. **useCallback for event handlers**: Prevents child component re-renders
2. **useMemo for expensive calculations**: Only recalculate when necessary
3. **React.memo for components**: Prevents unnecessary re-renders
4. **Proper dependency arrays**: Ensures hooks work correctly
5. **Input validation**: Prevents invalid data and improves UX

## Testing the Optimizations

To verify these optimizations work:

1. Open React DevTools Profiler
2. Record a session while typing in the amount field
3. Notice that only the AmountInput component re-renders
4. Swap tokens and see that exchange rate only calculates once
5. Submit form and observe minimal re-renders during API calls
