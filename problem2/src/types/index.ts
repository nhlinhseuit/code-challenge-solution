export interface Token {
  symbol: string;
  name: string;
  icon: string;
  price: number;
}

export interface SwapFormData {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
