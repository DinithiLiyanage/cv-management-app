const express = require('express');
const router = express.Router();
const orgController = require('../Controllers/orgController');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/create', authMiddleware, orgController.createOrganization);
// router.get('/:id', authMiddleware, orgController.getOrganizationById);
// router.put('/:id', authMiddleware, orgController.updateOrganization);
// router.delete('/:id', authMiddleware, orgController.deleteOrganization);

module.exports = router;