const express = require('express');
const router = express.Router();
const companyController = require('./company.controller');

router.post('/', companyController.createCompany);
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);

module.exports = router;
