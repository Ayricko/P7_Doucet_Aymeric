const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth-test');
const multer = require('../middleware/multer-config');

const usersCtrl = require('../controllers/userCtrl');

router.post('/register/', usersCtrl.register);
router.post('/login/', usersCtrl.login);
router.get('/profile/', auth, usersCtrl.getUserProfile);
router.put('/profile/', usersCtrl.updateUserProfile);
router.delete('/profile/', usersCtrl.deleteUserProfile);

module.exports = router;
