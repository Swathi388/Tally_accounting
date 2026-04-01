const { Ledger, Group, Transaction, sequelize } = require('../../models');

// Create a Ledger under a Group
exports.createLedger = async (req, res) => {
  try {
    const { companyId, CompanyId, groupId, GroupId, name, openingBalance, openingBalanceType, description, address, gstNumber, groupName } = req.body;
    let finalGroupId = groupId || GroupId;
    
    // Auto-resolve groupName to GroupId for CRM endpoints
    if (!finalGroupId && groupName) {
      const foundGroup = await Group.findOne({ 
        where: { name: groupName, CompanyId: companyId || CompanyId } 
      });
      if (foundGroup) finalGroupId = foundGroup.id;
    }

    const ledger = await Ledger.create({
      name,
      openingBalance: openingBalance || 0,
      openingBalanceType: openingBalanceType || 'Dr',
      currentBalance: openingBalance || 0,
      description,
      address,
      gstNumber,
      GroupId: finalGroupId,
      CompanyId: companyId || CompanyId
    });
    res.status(201).json(ledger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Ledgers for a company, grouped by their parent Group
exports.getLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.findAll({
      where: { CompanyId: req.params.companyId },
      include: [{ model: Group, attributes: ['id', 'name', 'nature'] }],
      order: [['name', 'ASC']]
    });
    res.json(ledgers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Ledger with its computed balance (from transactions)
exports.getLedgerBalance = async (req, res) => {
  try {
    const ledger = await Ledger.findByPk(req.params.id, {
      include: [{ model: Group, attributes: ['name', 'nature'] }]
    });
    if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

    // Compute balance from transactions (Tally way: never trust stored balance)
    const result = await Transaction.findAll({
      where: { LedgerId: req.params.id },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('debit')), 'totalDebit'],
        [sequelize.fn('SUM', sequelize.col('credit')), 'totalCredit']
      ],
      raw: true
    });

    const totalDebit = parseFloat(result[0].totalDebit || 0);
    const totalCredit = parseFloat(result[0].totalCredit || 0);
    const computedBalance = parseFloat(ledger.openingBalance) + totalDebit - totalCredit;

    res.json({
      ...ledger.toJSON(),
      computedBalance,
      totalDebit,
      totalCredit
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a ledger
exports.updateLedger = async (req, res) => {
  try {
    const { name, groupId, openingBalance, openingBalanceType, description, address, gstNumber } = req.body;
    const ledger = await Ledger.findByPk(req.params.id);
    if (!ledger) return res.status(404).json({ error: 'Ledger not found' });
    
    await ledger.update({ 
      name, 
      GroupId: groupId, 
      openingBalance: openingBalance || 0,
      openingBalanceType: openingBalanceType || 'Dr',
      currentBalance: openingBalance || 0,
      description,
      address,
      gstNumber
    });
    res.json(ledger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions for a specific ledger
exports.getLedgerTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { LedgerId: req.params.id },
      include: [{ model: Voucher, attributes: ['voucherNumber', 'voucherType', 'date', 'narration'] }],
      order: [[Voucher, 'date', 'DESC']]
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Ledger (only if no transactions exist)
exports.deleteLedger = async (req, res) => {
  try {
    const txCount = await Transaction.count({ where: { LedgerId: req.params.id } });
    if (txCount > 0) {
      return res.status(400).json({ error: 'Cannot delete ledger with existing transactions.' });
    }
    await Ledger.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Ledger deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
