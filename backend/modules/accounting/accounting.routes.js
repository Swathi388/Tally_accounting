const express = require('express');
const router = express.Router();
const accountingService = require('./accounting.service');

router.post('/calculate-gst', (req, res) => {
  const { amount, rate, isInterstate } = req.body;
  const result = accountingService.calculateGST(amount, rate, isInterstate);
  res.json(result);
});

router.post('/scan-receipt', async (req, res) => {
  const result = await accountingService.simulateAIOCR(req.body.fileName);
  res.json(result);
});

module.exports = router;
