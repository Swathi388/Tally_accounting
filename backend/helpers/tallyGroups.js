const standardGroups = [
  { name: 'Capital Account', nature: 'Liabilities' },
  { name: 'Loans (Liability)', nature: 'Liabilities' },
  { name: 'Current Liabilities', nature: 'Liabilities' },
  { name: 'Fixed Assets', nature: 'Assets' },
  { name: 'Investments', nature: 'Assets' },
  { name: 'Current Assets', nature: 'Assets' },
  { name: 'Sales Accounts', nature: 'Income' },
  { name: 'Purchase Accounts', nature: 'Expenses' },
  { name: 'Direct Incomes', nature: 'Income' },
  { name: 'Indirect Incomes', nature: 'Income' },
  { name: 'Direct Expenses', nature: 'Expenses' },
  { name: 'Indirect Expenses', nature: 'Expenses' },
  { name: 'Suspense Account', nature: 'Liabilities' },
  { name: 'Bank Accounts', nature: 'Assets', parent: 'Current Assets' },
  { name: 'Cash-in-Hand', nature: 'Assets', parent: 'Current Assets' },
  { name: 'Stock-in-Hand', nature: 'Assets', parent: 'Current Assets' },
  { name: 'Sundry Debtors', nature: 'Assets', parent: 'Current Assets' },
  { name: 'Sundry Creditors', nature: 'Liabilities', parent: 'Current Liabilities' },
  { name: 'Duties & Taxes', nature: 'Liabilities', parent: 'Current Liabilities' },
  { name: 'Provisions', nature: 'Liabilities', parent: 'Current Liabilities' },
  { name: 'Bank OD A/c', nature: 'Liabilities', parent: 'Loans (Liability)' },
  { name: 'Secured Loans', nature: 'Liabilities', parent: 'Loans (Liability)' },
  { name: 'Unsecured Loans', nature: 'Liabilities', parent: 'Loans (Liability)' },
  { name: 'Reserves & Surplus', nature: 'Liabilities', parent: 'Capital Account' }
];

module.exports = { standardGroups };
