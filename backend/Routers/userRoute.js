const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authMiddleware = require('../Middleware/authMiddleware');

router.get('/profile/:id', authMiddleware, userController.getProfile);
router.put('/profile/:id', authMiddleware, userController.updateProfile);

router.get('/account/:id', authMiddleware, userController.getAccount);
router.put('/account/:id', authMiddleware, userController.updateAccount);
router.post('/account/:id/change-password', authMiddleware, userController.changePassword);
router.get('/organizations/:id', authMiddleware, userController.getUserOrganizations);
router.post('/organizations/:id/join', authMiddleware, userController.requestToJoinOrganization);
router.get('/organizations/:id/search', userController.searchOrganizations);


module.exports = router;