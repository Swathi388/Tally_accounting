const { Voucher, Transaction, Ledger, sequelize } = require('../models');

class VoucherService {
  /**
   * Create a double-entry voucher with its transactions
   * @param {Object} voucherData { companyId, voucherType, date, narration, transactions: [{ledgerId, debit, credit}] }
   */
  async createVoucher(voucherData) {
    const t = await sequelize.transaction();

    try {
      // 1. Verify Double Entry Rule
      const totalDebit = voucherData.transactions.reduce((sum, tr) => sum + Number(tr.debit || 0), 0);
      const totalCredit = voucherData.transactions.reduce((sum, tr) => sum + Number(tr.credit || 0), 0);

      // Using a small epsilon for floating point comparison if necessary, 
      // but here we expect exact match as it's financial.
      if (Math.abs(totalDebit - totalCredit) > 0.001) {
        throw new Error(`Double Entry Mismatch: Total Debit (${totalDebit}) must equal Total Credit (${totalCredit})`);
      }

      // 2. Create the Voucher
      const voucher = await Voucher.create({
        voucherType: voucherData.voucherType,
        date: voucherData.date,
        narration: voucherData.narration,
        voucherNumber: voucherData.voucherNumber,
        CompanyId: voucherData.companyId
      }, { transaction: t });

      // 3. Create Transactions and Update Ledger Balances
      for (const trData of voucherData.transactions) {
        await Transaction.create({
          ...trData,
          VoucherId: voucher.id,
          LedgerId: trData.ledgerId
        }, { transaction: t });

        // Update Ledger Current Balance (Simplified: In Tally, we'd compute this on fly for reports, 
        // but for speed we maintain currentBalance)
        const ledger = await Ledger.findByPk(trData.ledgerId, { transaction: t });
        const change = (trData.debit || 0) - (trData.credit || 0);
        
        // Note: Sign depends on account nature, but fundamentally debit adds to balance 
        // and credit subtracts (or vice-versa for liabilities). 
        // We'll store it as absolute balance and handle sign in reports.
        ledger.currentBalance = Number(ledger.currentBalance) + change;
        await ledger.save({ transaction: t });
      }

      await t.commit();
      return voucher;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new VoucherService();
