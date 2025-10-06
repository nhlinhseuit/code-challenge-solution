const sumToN_Loop = (n) => {
  if (!Number.isInteger(n) || n < 1) {
    return 0;
  }

  let total = 0;

  for (let i = 1; i <= n; i++) {
    total += i;
  }

  return total;
};

const sumToN_Formula = (n) => {
  if (!Number.isInteger(n) || n < 1) {
    return 0;
  }
  return (n * (n + 1)) / 2;
};

const sumToN_Recursion = (n) => {
  if (n <= 0 || !Number.isInteger(n)) {
    return 0;
  }
  return n + sumToN_Recursion(n - 1);
};

const n = 5;
console.log(`Sum to ${n} (Loop): ${sumToN_Loop(n)}`);
console.log(`Sum to ${n} (Formula): ${sumToN_Formula(n)}`);
console.log(`Sum to ${n} (Recursion): ${sumToN_Recursion(n)}`);
