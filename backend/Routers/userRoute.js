const express = require('express');

const router = express.Router();
const userController = require('../Controllers/userController');

router.get('/profile/:id', userController.getProfile);
router.put('/profile/:id', userController.updateProfile);

router.get('/account/:id', userController.getAccount);
router.put('/account/:id', userController.updateAccount);

module.exports = router;