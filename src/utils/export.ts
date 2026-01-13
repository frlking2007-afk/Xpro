import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { formatCurrency, getCurrencySymbol } from './currency';

export interface ExportSettings {
  paperWidth: '58mm' | '80mm';
  fontSize: 'small' | 'medium' | 'large';
  showHeader: boolean;
  showFooter: boolean;
  showDate: boolean;
  showTime: boolean;
  headerText?: string;
  footerText?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  category?: string;
}

// Get saved export settings
export function getExportSettings(itemType: 'category' | 'payment', itemName: string): ExportSettings {
  const saved = localStorage.getItem(`exportSettings_${itemType}_${itemName}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return getDefaultSettings();
    }
  }
  return getDefaultSettings();
}

export function getDefaultSettings(): ExportSettings {
  return {
    paperWidth: '58mm',
    fontSize: 'medium',
    showHeader: true,
    showFooter: true,
    showDate: true,
    showTime: true,
    headerText: '',
    footerText: '',
  };
}

// Get category sales from localStorage
function getCategorySales(categoryName: string): number {
  const saved = localStorage.getItem(`categorySales_${categoryName}`);
  return saved ? parseFloat(saved) : 0;
}

// Generate receipt HTML for expenses (categories)
export function generateExpenseReceiptHTML(
  transactions: Transaction[],
  categoryName: string,
  settings: ExportSettings,
  shiftName?: string
): string {
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const sales = getCategorySales(categoryName);
  const profitOrLoss = sales - totalExpenses;
  const now = new Date();
  
  // Calculate width based on paper size
  const width = settings.paperWidth === '58mm' ? '48mm' : '72mm';
  const fontSize = settings.fontSize === 'small' ? '9px' : settings.fontSize === 'medium' ? '11px' : '13px';
  const titleSize = settings.fontSize === 'small' ? '13px' : settings.fontSize === 'medium' ? '15px' : '17px';
  const lineHeight = '1.2';
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${categoryName} - Xarajatlar</title>
  <style>
    @media print {
      @page {
        size: ${settings.paperWidth};
        margin: 0;
      }
      body {
        margin: 0;
        padding: 4px;
      }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Courier New', monospace;
      width: ${width};
      margin: 0 auto;
      padding: 4px;
      font-size: ${fontSize};
      line-height: ${lineHeight};
      background: white;
      color: black;
    }
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }
    .title {
      font-weight: bold;
      font-size: ${titleSize};
      margin-bottom: 2px;
    }
    .info {
      font-size: ${fontSize};
      color: #000;
      margin: 1px 0;
    }
    .divider {
      border-top: 1px dashed #000;
      margin: 3px 0;
    }
    .section {
      margin: 3px 0;
    }
    .section-title {
      font-weight: bold;
      font-size: ${fontSize};
      margin-bottom: 2px;
      text-decoration: underline;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 1px 0;
      font-size: ${fontSize};
    }
    .row-label {
      font-weight: bold;
    }
    .row-value {
      font-weight: bold;
    }
    .item {
      margin: 1px 0;
      font-size: ${fontSize};
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .item-time {
      font-size: ${parseInt(fontSize) - 1}px;
      color: #666;
      margin-top: 1px;
    }
    .item-desc {
      flex: 1;
      word-wrap: break-word;
      margin-right: 4px;
    }
    .item-amount {
      font-weight: bold;
      white-space: nowrap;
    }
    .total {
      border-top: 2px solid #000;
      margin-top: 4px;
      padding-top: 3px;
      font-weight: bold;
      font-size: ${parseInt(fontSize) + 1}px;
    }
    .footer {
      text-align: center;
      border-top: 1px dashed #000;
      padding-top: 4px;
      margin-top: 4px;
      font-size: ${parseInt(fontSize) - 1}px;
    }
    .center {
      text-align: center;
    }
  </style>
</head>
<body>
`;

  // Date (larger)
  html += `<div class="date">${format(now, 'dd.MM.yyyy', { locale: uz })}</div>`;

  // Category Name
  html += `<div class="title center">${categoryName}</div>`;

  html += `<div class="divider"></div>`;

  // Sales
  html += `<div class="section">`;
  html += `<div class="row">`;
  html += `<span class="row-label">Savdo:</span>`;
  html += `<span class="row-value">${formatAmount(sales)}</span>`;
  html += `</div>`;
  html += `</div>`;

  // Total Expenses
  html += `<div class="section">`;
  html += `<div class="row">`;
  html += `<span class="row-label">Umumiy xarajat:</span>`;
  html += `<span class="row-value">${formatAmount(totalExpenses)}</span>`;
  html += `</div>`;
  html += `</div>`;

  // Profit/Loss
  html += `<div class="section">`;
  html += `<div class="row">`;
  html += `<span class="row-label">${profitOrLoss >= 0 ? 'Foyda:' : 'Zarar:'}</span>`;
  html += `<span class="row-value">${formatAmount(Math.abs(profitOrLoss))}</span>`;
  html += `</div>`;
  html += `</div>`;

  html += `<div class="divider"></div>`;

  // Expenses History
  html += `<div class="section-title">Xarajatlar tarixi:</div>`;
  if (transactions.length === 0) {
    html += `<div class="info">Xarajatlar mavjud emas</div>`;
  } else {
    transactions.forEach((transaction, index) => {
      const desc = transaction.description || 'Izohsiz';
      // Remove category prefix if exists
      const cleanDesc = desc.replace(`[${categoryName}]`, '').trim();
      const amount = formatAmount(transaction.amount);
      const transactionDate = new Date(transaction.date);
      const timeStr = format(transactionDate, 'HH:mm', { locale: uz });
      
      html += `
      <div class="item">
        <div class="item-amount">${index + 1}. ${amount}</div>
        <div class="item-desc">
          ${cleanDesc}
          <div class="item-time">${timeStr}</div>
        </div>
      </div>
      `;
    });
  }

  html += `<div class="divider"></div>`;

  // Footer
  if (settings.showFooter && settings.footerText) {
    html += `<div class="footer">${settings.footerText}</div>`;
  }

  html += `
</body>
</html>
`;

  return html;
}

// Generate receipt HTML for payment types (uzcard, humo, click)
export function generatePaymentReceiptHTML(
  transactions: Transaction[],
  paymentName: string,
  settings: ExportSettings,
  shiftName?: string
): string {
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const now = new Date();
  
  // Calculate width based on paper size
  const width = settings.paperWidth === '58mm' ? '48mm' : '72mm';
  const fontSize = settings.fontSize === 'small' ? '9px' : settings.fontSize === 'medium' ? '11px' : '13px';
  const titleSize = settings.fontSize === 'small' ? '13px' : settings.fontSize === 'medium' ? '15px' : '17px';
  const dateSize = settings.fontSize === 'small' ? '12px' : settings.fontSize === 'medium' ? '14px' : '16px';
  const lineHeight = '1.2';
  
  // Format number without currency symbol
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('uz-UZ');
  };
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${paymentName.toUpperCase()}</title>
  <style>
    @media print {
      @page {
        size: ${settings.paperWidth};
        margin: 0;
      }
      body {
        margin: 0;
        padding: 4px;
      }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Courier New', monospace;
      width: ${width};
      margin: 0 auto;
      padding: 4px;
      font-size: ${fontSize};
      line-height: ${lineHeight};
      background: white;
      color: black;
    }
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }
    .title {
      font-weight: bold;
      font-size: ${titleSize};
      margin-bottom: 2px;
    }
    .info {
      font-size: ${fontSize};
      color: #000;
      margin: 1px 0;
    }
    .divider {
      border-top: 1px dashed #000;
      margin: 3px 0;
    }
    .section {
      margin: 3px 0;
    }
    .section-title {
      font-weight: bold;
      font-size: ${fontSize};
      margin-bottom: 2px;
      text-decoration: underline;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 1px 0;
      font-size: ${fontSize};
    }
    .row-label {
      font-weight: bold;
    }
    .row-value {
      font-weight: bold;
    }
    .item {
      margin: 1px 0;
      font-size: ${fontSize};
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .item-time {
      font-size: ${parseInt(fontSize) - 1}px;
      color: #666;
      margin-top: 1px;
    }
    .item-desc {
      flex: 1;
      word-wrap: break-word;
      margin-right: 4px;
    }
    .item-amount {
      font-weight: bold;
      white-space: nowrap;
    }
    .total {
      border-top: 2px solid #000;
      margin-top: 4px;
      padding-top: 3px;
      font-weight: bold;
      font-size: ${parseInt(fontSize) + 1}px;
    }
    .footer {
      text-align: center;
      border-top: 1px dashed #000;
      padding-top: 4px;
      margin-top: 4px;
      font-size: ${parseInt(fontSize) - 1}px;
    }
    .center {
      text-align: center;
    }
  </style>
</head>
<body>
`;

  // Date (larger)
  html += `<div class="date">${format(now, 'dd.MM.yyyy', { locale: uz })}</div>`;

  // Payment Name
  html += `<div class="title center">${paymentName.toUpperCase()}</div>`;

  html += `<div class="divider"></div>`;

  // Total Balance
  html += `<div class="section">`;
  html += `<div class="row">`;
  html += `<span class="row-label">Umumiy balans:</span>`;
  html += `<span class="row-value">${formatAmount(totalBalance)}</span>`;
  html += `</div>`;
  html += `</div>`;

  html += `<div class="divider"></div>`;

  // Operations History
  html += `<div class="section-title">Operatsiyalar tarixi:</div>`;
  if (transactions.length === 0) {
    html += `<div class="info">Operatsiyalar mavjud emas</div>`;
  } else {
    transactions.forEach((transaction, index) => {
      const desc = transaction.description || 'Izohsiz';
      const amount = formatAmount(transaction.amount);
      const transactionDate = new Date(transaction.date);
      const timeStr = format(transactionDate, 'HH:mm', { locale: uz });
      
      html += `
      <div class="item">
        <div class="item-amount">${index + 1}. ${amount}</div>
        <div class="item-desc">
          ${desc}
          <div class="item-time">${timeStr}</div>
        </div>
      </div>
      `;
    });
  }

  html += `
</body>
</html>
`;

  return html;
}

// Legacy function for backward compatibility
export function generateReceiptHTML(
  transactions: Transaction[],
  title: string,
  settings: ExportSettings,
  shiftName?: string
): string {
  // This is a fallback - should use generateExpenseReceiptHTML or generatePaymentReceiptHTML instead
  return generateExpenseReceiptHTML(transactions, title, settings, shiftName);
}

// Print receipt
export function printReceipt(html: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Print window yopilgan. Iltimos, popup blokirovkasini o\'chiring.');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

// Export to PDF (alternative method)
export function exportToPDF(html: string, filename: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Print window yopilgan. Iltimos, popup blokirovkasini o\'chiring.');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Use browser's print to PDF
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
