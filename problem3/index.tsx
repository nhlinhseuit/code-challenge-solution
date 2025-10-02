// Wallet balance interface, adding the missing 'blockchain' field
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; 
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 20
    default:
      return -99
  }
}

const WalletPage: React.FC<Props> = (props: Props) => {
  // Destructure props, discarding 'children' if unused
  const { ...rest } = props; 
  
  // Assume hooks are defined elsewhere
  const balances: WalletBalance[] = useWalletBalances(); 
  const prices: { [key: string]: number } = usePrices();

  const sortedAndFilteredBalances = useMemo(() => {
    
    // Filter out invalid balances and those with zero/negative amounts
    const filteredBalances = balances.filter((balance: WalletBalance) => {
      const priority = getPriority(balance.blockchain);
      // Filter logic: Only keep balances with valid priority (>-99) AND a positive amount (> 0)
      return priority > -99 && balance.amount > 0;
    });

    return filteredBalances.sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);

      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
      return 0; // Maintain order
    });
  // Dependency array uses 'balances' only, as 'prices' does not affect filtering/sorting logic
  }, [balances]); 

  // Map filtered balances to WalletRow components
  const rows = sortedAndFilteredBalances.map((balance: WalletBalance) => {
    // Calculate USD value
    const usdValue = prices[balance.currency] * balance.amount;
    
    // Format amount 
    const formattedAmount = balance.amount.toFixed(4); 
    
    // Use unique currency as key for stable rendering
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency} 
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formattedAmount}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};
