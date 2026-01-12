// Currency utility functions

type Currency = 'UZS' | 'USD' | 'EUR';

const CURRENCY_STORAGE_KEY = 'currency';

// Exchange rates (you can update these or fetch from API)
const EXCHANGE_RATES: Record<Currency, number> = {
  UZS: 1,
  USD: 12500, // 1 USD = 12500 UZS (update this with real rate)
  EUR: 13500, // 1 EUR = 13500 UZS (update this with real rate)
};

/**
 * Get current currency from localStorage
 */
export function getCurrency(): Currency {
  const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency;
  return saved && ['UZS', 'USD', 'EUR'].includes(saved) ? saved : 'UZS';
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(amount: number, currency?: Currency): string {
  const currentCurrency = currency || getCurrency();
  
  if (currentCurrency === 'UZS') {
    return `${amount.toLocaleString('uz-UZ')} UZS`;
  }
  
  // Convert to selected currency
  const rate = EXCHANGE_RATES[currentCurrency];
  const convertedAmount = amount / rate;
  
  // Format based on currency
  if (currentCurrency === 'USD') {
    return `$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  if (currentCurrency === 'EUR') {
    return `€${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return `${amount.toLocaleString('uz-UZ')} UZS`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency?: Currency): string {
  const currentCurrency = currency || getCurrency();
  switch (currentCurrency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return 'UZS';
  }
}

/**
 * Convert amount to selected currency
 */
export function convertCurrency(amount: number, currency?: Currency): number {
  const currentCurrency = currency || getCurrency();
  
  if (currentCurrency === 'UZS') {
    return amount;
  }
  
  const rate = EXCHANGE_RATES[currentCurrency];
  return amount / rate;
}
