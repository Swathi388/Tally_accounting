const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');

router.get('/trial-balance/:companyId', reportsController.getTrialBalance);
router.get('/profit-loss/:companyId', reportsController.getProfitAndLoss);
router.get('/balance-sheet/:companyId', reportsController.getBalanceSheet);
router.get('/daybook/:companyId', reportsController.getDaybook);
router.get('/dashboard/:companyId', reportsController.getDashboardStats);
router.get('/ledger-statement/:ledgerId', reportsController.getLedgerStatement);
router.get('/audit/:companyId', reportsController.getAuditLogs);

module.exports = router;

