const RATES: Record<string, number> = {
  USD: 1,
  SAR: 3.75,
  AED: 3.67,
  EUR: 0.92,
  EGP: 30.9,
  KWD: 0.31,
  QAR: 3.64,
  GBP: 0.79,
};

const SYMBOLS: Record<string, string> = {
  USD: '$',
  SAR: '﷼',
  AED: 'د.إ',
  EUR: '€',
  EGP: 'E£',
  KWD: 'KD',
  QAR: 'QR',
  GBP: '£',
};

export const CURRENCY_LIST = ['USD', 'SAR', 'AED', 'EUR', 'EGP', 'KWD', 'QAR', 'GBP'];

export const formatPrice = (priceInUSD: number, targetCurrency: string): string => {
  const rate = RATES[targetCurrency] ?? 1;
  const symbol = SYMBOLS[targetCurrency] ?? '$';
  const converted = priceInUSD * rate;

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(converted);

  if (['SAR', 'AED', 'EGP', 'KWD', 'QAR'].includes(targetCurrency)) {
    return `${formatted} ${symbol}`;
  }
  return `${symbol}${formatted}`;
};
