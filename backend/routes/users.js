const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const usersCtrl = require('../controllers/userCtrl');

router.post('/register/', usersCtrl.register);
router.post('/login/', usersCtrl.login);
router.get('/profile/', usersCtrl.getUserProfile);
router.put('/profile/', usersCtrl.updateUserProfile);
router.delete('/profile/', usersCtrl.deleteUserProfile);

module.exports = router;
