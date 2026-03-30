const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');

router.post('/', inventoryController.createItem);
router.get('/:companyId', inventoryController.getItems);
router.post('/stock/:itemId', inventoryController.updateStock);

module.exports = router;
