const express = require('express');
const router = express.Router();
const voucherController = require('./voucher.controller');

router.post('/', voucherController.createVoucher);
router.get('/:companyId', voucherController.getVouchers);
router.get('/detail/:id', voucherController.getVoucherById);

module.exports = router;
