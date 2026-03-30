const express = require('express');
const router = express.Router();
const c = require('./purchase.controller');

router.get('/:companyId', c.getPurchaseOrders);
router.post('/', c.createPurchaseOrder);
router.put('/:id', c.updatePurchaseOrder);
router.delete('/:id', c.deletePurchaseOrder);

module.exports = router;
