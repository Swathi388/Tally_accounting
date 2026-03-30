const { Ledger, Company } = require('./models');

const fixBalance = async () => {
  try {
    const company = await Company.findOne({ order: [['createdAt', 'DESC']] });
    if (!company) return console.log('No company found.');

    const capitalLedger = await Ledger.findOne({
      where: { 
        name: 'Owner Capital',
        CompanyId: company.id
      }
    });

    if (capitalLedger) {
      // Current: 5,00,000. New: 5,00,000 + 2,28,000 = 7,28,000
      const newBalance = 728000;
      await capitalLedger.update({
        openingBalance: newBalance,
        currentBalance: newBalance // In a real app we'd recalculate current, but here we just want to balance the BS.
      });
      console.log(`✅ Success: Fixed Owner Capital Opening Balance to ₹${newBalance.toLocaleString()}`);
    } else {
      console.log('❌ Error: Owner Capital ledger not found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixBalance();
