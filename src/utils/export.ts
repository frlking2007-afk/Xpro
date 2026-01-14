// Export utilities for generating receipt HTML - optimized for single page printing
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
  // Further reduce font sizes to fit everything on one page
  const fontSize = settings.fontSize === 'small' ? '7px' : settings.fontSize === 'medium' ? '9px' : '11px';
  const titleSize = settings.fontSize === 'small' ? '11px' : settings.fontSize === 'medium' ? '13px' : '15px';
  // Date size - larger and bolder
  const dateSize = settings.fontSize === 'small' ? '20px' : settings.fontSize === 'medium' ? '18px' : '20px';
  const descSize = settings.fontSize === 'small' ? '9px' : settings.fontSize === 'medium' ? '11px' : '13px';
  const lineHeight = '1';
  
  // Format number without currency symbol
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('uz-UZ');
  };
  
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
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        page-break-inside: avoid !important;
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        orphans: 999 !important;
        widows: 999 !important;
      }
      .section-title {
        page-break-after: avoid;
        page-break-before: avoid;
        break-after: avoid;
        break-before: avoid;
      }
      div[style*="page-break-inside: avoid"] {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        orphans: 999 !important;
        widows: 999 !important;
        display: block !important;
      }
      .item {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        display: block;
        orphans: 999 !important;
        widows: 999 !important;
        page-break-before: avoid !important;
        break-before: avoid !important;
      }
      .divider {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-before: avoid !important;
        break-before: avoid !important;
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
      padding: 0;
      font-size: ${fontSize};
      line-height: ${lineHeight};
      background: white;
      color: black;
      height: auto;
      min-height: auto;
      max-height: none;
    }
    .date {
      font-size: ${dateSize};
      font-weight: 900;
      text-align: center;
      margin: 0;
      padding: 0;
      line-height: 1;
      color: #000;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 2px;
      margin-bottom: 2px;
    }
    .title {
      font-weight: bold;
      font-size: ${titleSize};
      margin: 0;
      padding: 0;
      line-height: 1;
    }
    .info {
      font-size: ${fontSize};
      color: #000;
      margin: 0;
      padding: 0;
      line-height: 1;
    }
    .divider {
      border-top: 1px dashed #000;
      margin: 0;
      padding: 0;
      height: 1px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section {
      margin: 0;
      padding: 0;
    }
    .section-title {
      font-weight: bold;
      font-size: ${fontSize};
      margin: 0;
      padding: 0;
      text-decoration: underline;
      line-height: 1;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 0;
      padding: 0;
      font-size: ${fontSize};
      line-height: 1;
    }
    .row-label {
      font-weight: bold;
    }
    .row-value {
      font-weight: bold;
    }
    .item {
      margin: 0;
      padding: 0;
      font-size: ${fontSize};
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      line-height: 1;
    }
    .item-time {
      font-size: ${parseInt(fontSize) - 1}px;
      color: #666;
      margin: 0;
      padding: 0;
      line-height: 1;
    }
    .item-desc {
      flex: 1;
      word-wrap: break-word;
      font-weight: bold;
      font-size: ${descSize};
      color: #000;
      line-height: 1;
      margin: 0;
      padding: 0;
    }
    .item-amount {
      font-weight: bold;
      white-space: nowrap;
      margin: 0;
      padding: 0;
    }
    .total {
      border-top: 2px solid #000;
      margin-top: 2px;
      padding-top: 2px;
      font-weight: bold;
      font-size: ${parseInt(fontSize) + 1}px;
      line-height: 1;
    }
    .footer {
      text-align: center;
      border-top: 1px dashed #000;
      padding-top: 2px;
      margin-top: 2px;
      font-size: ${parseInt(fontSize) - 1}px;
      line-height: 1;
    }
    .center {
      text-align: center;
    }
  </style>
</head>
<body>
`;

  // Wrap ALL content in one container to prevent any page breaks
  html += `<div style="page-break-inside: avoid !important; break-inside: avoid !important; orphans: 999 !important; widows: 999 !important; display: block !important;">`;
  
  // Date (larger)
  html += `<div class="date">${format(now, 'dd.MM.yyyy', { locale: uz })}</div>`;

  // Category Name
  html += `<div class="title center">${categoryName}</div>`;

  // Sales
  html += `<div class="section"><div class="row"><span class="row-label">Savdo:</span><span class="row-value">${formatAmount(sales)}</span></div></div><div class="divider"></div>`;

  // Total Expenses
  html += `<div class="section"><div class="row"><span class="row-label">Umumiy xarajat:</span><span class="row-value">${formatAmount(totalExpenses)}</span></div></div><div class="divider"></div>`;

  // Profit/Loss
  html += `<div class="section"><div class="row"><span class="row-label">${profitOrLoss >= 0 ? 'Foyda:' : 'Zarar:'}</span><span class="row-value">${formatAmount(Math.abs(profitOrLoss))}</span></div></div><div class="divider"></div>`;

  // Expenses History
  html += `<div class="section-title" style="page-break-before: avoid !important; break-before: avoid !important; page-break-after: avoid !important; break-after: avoid !important;">Xarajatlar tarixi:</div>`;
  html += `<div class="divider" style="page-break-before: avoid !important; break-before: avoid !important; page-break-after: avoid !important; break-after: avoid !important;"></div>`;
  if (transactions.length === 0) {
    html += `<div class="info">Xarajatlar mavjud emas</div>`;
  } else {
    transactions.forEach((transaction) => {
      const desc = transaction.description || 'Izohsiz';
      // Remove category prefix if exists
      const cleanDesc = desc.replace(`[${categoryName}]`, '').trim();
      const amount = formatAmount(transaction.amount);
      
      html += `<div class="item"><div class="item-amount">${amount}</div><div class="item-desc">${cleanDesc}</div></div><div class="divider"></div>`;
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
  // Further reduce font sizes to fit everything on one page
  const fontSize = settings.fontSize === 'small' ? '7px' : settings.fontSize === 'medium' ? '9px' : '11px';
  const titleSize = settings.fontSize === 'small' ? '11px' : settings.fontSize === 'medium' ? '13px' : '15px';
  // Date size - larger and bolder
  // Date size - larger and bolder
  const dateSize = settings.fontSize === 'small' ? '20px' : settings.fontSize === 'medium' ? '18px' : '20px';
  const descSize = settings.fontSize === 'small' ? '9px' : settings.fontSize === 'medium' ? '11px' : '13px';
  const lineHeight = '1';
  
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
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        page-break-inside: avoid !important;
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        orphans: 999 !important;
        widows: 999 !important;
      }
      .section-title {
        page-break-after: avoid;
        page-break-before: avoid;
        break-after: avoid;
        break-before: avoid;
      }
      div[style*="page-break-inside: avoid"] {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        orphans: 999 !important;
        widows: 999 !important;
        display: block !important;
      }
      .item {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        display: block;
        orphans: 999 !important;
        widows: 999 !important;
        page-break-before: avoid !important;
        break-before: avoid !important;
      }
      .divider {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-before: avoid !important;
        break-before: avoid !important;
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
      padding: 0;
      font-size: ${fontSize};
      line-height: ${lineHeight};
      background: white;
      color: black;
      height: auto;
      min-height: auto;
      max-height: none;
    }
    .date {
      font-size: ${dateSize};
      font-weight: 900;
      text-align: center;
      margin: 0;
      padding: 0;
      line-height: 1;
      color: #000;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 2px;
      margin-bottom: 2px;
    }
    .title {
      font-weight: bold;
      font-size: ${titleSize};
      margin: 0;
      padding: 0;
      line-height: 1;
    }
    .info {
      font-size: ${fontSize};
      color: #000;
      margin: 0;
      padding: 0;
      line-height: 1;
    }
    .divider {
      border-top: 1px dashed #000;
      margin: 0;
      padding: 0;
      height: 1px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section {
      margin: 0;
      padding: 0;
    }
    .section-title {
      font-weight: bold;
      font-size: ${fontSize};
      margin: 0;
      padding: 0;
      text-decoration: underline;
      line-height: 1;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 0;
      padding: 0;
      font-size: ${fontSize};
      line-height: 1;
    }
    .row-label {
      font-weight: bold;
    }
    .row-value {
      font-weight: bold;
    }
    .item {
      margin: 0;
      padding: 0;
      font-size: ${fontSize};
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      line-height: 1;
    }
    .item-time {
      font-size: ${parseInt(fontSize) - 1}px;
      color: #666;
      margin: 0;
      padding: 0;
      line-height: 1;
    }
    .item-amount {
      font-weight: bold;
      white-space: nowrap;
      margin: 0;
      padding: 0;
      margin-right: 6px;
    }
    .item-desc {
      flex: 1;
      word-wrap: break-word;
      font-weight: bold;
      font-size: ${descSize};
      color: #000;
      line-height: 1;
      margin: 0;
      padding: 0;
    }
    .total {
      border-top: 2px solid #000;
      margin-top: 2px;
      padding-top: 2px;
      font-weight: bold;
      font-size: ${parseInt(fontSize) + 1}px;
      line-height: 1;
    }
    .footer {
      text-align: center;
      border-top: 1px dashed #000;
      padding-top: 2px;
      margin-top: 2px;
      font-size: ${parseInt(fontSize) - 1}px;
      line-height: 1;
    }
    .center {
      text-align: center;
    }
  </style>
</head>
<body>
`;

  // Wrap ALL content in one container to prevent any page breaks
  html += `<div style="page-break-inside: avoid !important; break-inside: avoid !important; orphans: 999 !important; widows: 999 !important; display: block !important;">`;
  
  // Date (larger)
  html += `<div class="date">${format(now, 'dd.MM.yyyy', { locale: uz })}</div>`;

  // Payment Name
  html += `<div class="title center">${paymentName.toUpperCase()}</div>`;

  // Total Balance
  html += `<div class="section"><div class="row"><span class="row-label">Umumiy balans:</span><span class="row-value">${formatAmount(totalBalance)}</span></div></div><div class="divider"></div>`;

  // Operations History
  html += `<div class="section-title" style="page-break-before: avoid !important; break-before: avoid !important; page-break-after: avoid !important; break-after: avoid !important;">Operatsiyalar tarixi:</div>`;
  html += `<div class="divider" style="page-break-before: avoid !important; break-before: avoid !important; page-break-after: avoid !important; break-after: avoid !important;"></div>`;
  html += `<div style="page-break-inside: avoid !important; break-inside: avoid !important; orphans: 999 !important; widows: 999 !important;">`;
  if (transactions.length === 0) {
    html += `<div class="info">Operatsiyalar mavjud emas</div>`;
  } else {
    transactions.forEach((transaction) => {
      const desc = transaction.description || 'Izohsiz';
      const amount = formatAmount(transaction.amount);
      html += `<div class="item"><div class="item-amount">${amount}</div><div class="item-desc">${desc}</div></div><div class="divider"></div>`;
    });
  }
  html += `</div>`;

  // Close the main container
  html += `</div>`;

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
