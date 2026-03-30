const express = require('express');
const router = express.Router();
const reconciliationController = require('./reconciliation.controller');

router.post('/import', reconciliationController.importStatement);
router.get('/unmatched/:companyId', reconciliationController.getUnmatched);
router.post('/reconcile', reconciliationController.reconcile);

module.exports = router;
