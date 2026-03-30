const express = require('express');
const router = express.Router();
const salesController = require('./sales.controller');

router.post('/orders', salesController.createOrder);
router.get('/orders/:companyId', salesController.getOrders);
router.put('/orders/:orderId', salesController.updateOrder);

router.post('/invoices', salesController.createInvoice);

module.exports = router;
