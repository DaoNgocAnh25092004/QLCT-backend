const express = require('express');
const router = express.Router();

const {
    validateSignUp,
    validateLogin,
    validateUpdateUser,
    validateDeleteUser,
    refreshAccessToken,
    verifyToken,
    requireAdmin,
    requireSelfOrAdmin,
} = require('../middlewares/validateAccount');
const accountController = require('../controllers/AccountController');

// Route cần xác thực

router.post('/refresh-token', refreshAccessToken);

router.delete('/delete/:id', validateDeleteUser, accountController.deleteAccount);

router.put('/update/:id', validateUpdateUser, accountController.updateAccount);

router.post('/sign-up', validateSignUp, accountController.create);

router.post('/login', validateLogin, accountController.login);

router.post('/logout', accountController.logout);

// Chỉ cho phép admin truy cập danh sách tất cả người dùng
router.get('/get-all', verifyToken, requireAdmin, accountController.getAllAccount);

// Cho phép admin xem thông tin của bất kỳ người dùng nào hoặc người dùng xem thông tin của chính họ
router.get('/get-details/:id', verifyToken, requireSelfOrAdmin, accountController.getDetailsAccount);

module.exports = router;
