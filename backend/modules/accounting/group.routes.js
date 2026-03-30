const express = require('express');
const router = express.Router();
const groupController = require('./group.controller');

router.post('/', groupController.createGroup);
router.get('/resolve', groupController.resolveCompanyGroups);   // ← auto-resolve route
router.get('/:companyId', groupController.getGroups);
router.post('/seed/:companyId', groupController.seedGroups);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);


module.exports = router;
