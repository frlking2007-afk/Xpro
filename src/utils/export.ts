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

// Generate receipt HTML for printing (Xprinter format)
export function generateReceiptHTML(
  transactions: Transaction[],
  title: string,
  settings: ExportSettings,
  shiftName?: string
): string {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const currency = getCurrencySymbol();
  const now = new Date();
  
  // Calculate width based on paper size
  const width = settings.paperWidth === '58mm' ? '48mm' : '72mm';
  const fontSize = settings.fontSize === 'small' ? '10px' : settings.fontSize === 'medium' ? '12px' : '14px';
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @media print {
      @page {
        size: ${settings.paperWidth};
        margin: 0;
      }
      body {
        margin: 0;
        padding: 8px;
      }
    }
    body {
      font-family: 'Courier New', monospace;
      width: ${width};
      margin: 0 auto;
      padding: 8px;
      font-size: ${fontSize};
      line-height: 1.4;
      background: white;
      color: black;
    }
    .header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .title {
      font-weight: bold;
      font-size: ${settings.fontSize === 'small' ? '12px' : settings.fontSize === 'medium' ? '14px' : '16px'};
      margin-bottom: 4px;
    }
    .info {
      font-size: ${settings.fontSize === 'small' ? '9px' : settings.fontSize === 'medium' ? '10px' : '12px'};
      color: #666;
    }
    .divider {
      border-top: 1px dashed #000;
      margin: 8px 0;
    }
    .item {
      margin: 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .item-desc {
      flex: 1;
      word-wrap: break-word;
      margin-right: 8px;
    }
    .item-amount {
      font-weight: bold;
      white-space: nowrap;
    }
    .total {
      border-top: 2px solid #000;
      margin-top: 8px;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: ${settings.fontSize === 'small' ? '12px' : settings.fontSize === 'medium' ? '14px' : '16px'};
    }
    .footer {
      text-align: center;
      border-top: 1px dashed #000;
      padding-top: 8px;
      margin-top: 8px;
      font-size: ${settings.fontSize === 'small' ? '9px' : settings.fontSize === 'medium' ? '10px' : '12px'};
    }
    .center {
      text-align: center;
    }
  </style>
</head>
<body>
`;

  // Header
  if (settings.showHeader) {
    html += `<div class="header">`;
    html += `<div class="title">${settings.headerText || title}</div>`;
    if (shiftName) {
      html += `<div class="info">${shiftName}</div>`;
    }
    if (settings.showDate || settings.showTime) {
      const dateTimeParts: string[] = [];
      if (settings.showDate) {
        dateTimeParts.push(format(now, 'd MMMM yyyy', { locale: uz }));
      }
      if (settings.showTime) {
        dateTimeParts.push(format(now, 'HH:mm', { locale: uz }));
      }
      if (dateTimeParts.length > 0) {
        html += `<div class="info">${dateTimeParts.join(' ')}</div>`;
      }
    }
    html += `</div>`;
  }

  // Items
  html += `<div class="divider"></div>`;
  transactions.forEach((transaction, index) => {
    const desc = transaction.description || 'Izohsiz';
    const amount = formatCurrency(transaction.amount);
    html += `
    <div class="item">
      <div class="item-desc">${index + 1}. ${desc}</div>
      <div class="item-amount">${amount}</div>
    </div>
    `;
  });

  // Total
  html += `<div class="divider"></div>`;
  html += `
  <div class="total">
    <span>JAMI:</span>
    <span>${formatCurrency(total)}</span>
  </div>
  `;

  // Footer
  if (settings.showFooter) {
    html += `<div class="footer">`;
    if (settings.footerText) {
      html += `<div>${settings.footerText}</div>`;
    }
    html += `<div class="info">Jami: ${transactions.length} ta operatsiya</div>`;
    html += `</div>`;
  }

  html += `
</body>
</html>
`;

  return html;
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
    // Close window after printing (optional)
    // printWindow.close();
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
