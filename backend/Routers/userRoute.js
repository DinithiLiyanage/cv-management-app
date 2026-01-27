const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authMiddleware = require('../Middleware/authMiddleware');

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

router.get('/account', authMiddleware, userController.getAccount);
router.put('/account', authMiddleware, userController.updateAccount);
router.post('/account/change-password', authMiddleware, userController.changePassword);
router.get('/organizations', authMiddleware, userController.getUserOrganizations);
router.post('/organizations/join', authMiddleware, userController.requestToJoinOrganization);
router.get('/organizations/search', userController.searchOrganizations);


module.exports = router;