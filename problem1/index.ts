// Using a Loop (O(n) Time Complexity)
const sumToN_Loop = (n: number): number => {
  if (!Number.isInteger(n) || n < 1) {
    return 0;
  }

  let total: number = 0;

  for (let i = 1; i <= n; i++) {
    total += i;
  }

  return total;
};

// Using a Mathematical Formula (O(1) Time Complexity)
const sumToN_Formula = (n: number): number => {
  if (!Number.isInteger(n) || n < 1) {
    return 0;
  }
  return (n * (n + 1)) / 2;
};

// Using Recursion (O(n) Time Complexity)
const sumToN_Recursion = (n: number): number => {
  if (n <= 0 || !Number.isInteger(n)) {
    return 0;
  }
  return n + sumToN_Recursion(n - 1);
};

const n = 5;
console.log(`Sum to ${n} (Loop): ${sumToN_Loop(n)}`); // Output: 15
console.log(`Sum to ${n} (Formula): ${sumToN_Formula(n)}`); // Output: 15
console.log(`Sum to ${n} (Recursion): ${sumToN_Recursion(n)}`); // Output: 15
