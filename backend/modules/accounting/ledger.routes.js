const express = require('express');
const router = express.Router();
const ledgerController = require('./ledger.controller');

router.post('/', ledgerController.createLedger);
router.get('/:companyId', ledgerController.getLedgers);
router.get('/balance/:id', ledgerController.getLedgerBalance);
router.get('/transactions/:id', ledgerController.getLedgerTransactions);
router.put('/:id', ledgerController.updateLedger);
router.delete('/:id', ledgerController.deleteLedger);

module.exports = router;
