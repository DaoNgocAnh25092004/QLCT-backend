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
} = require('../middlewares/validateUser');
const userController = require('../controllers/UserController');

// Route cần xác thực

router.post('/refresh-token', refreshAccessToken);

router.delete('/delete/:id', validateDeleteUser, userController.deleteUser);

router.put('/update/:id', validateUpdateUser, userController.updateUser);

router.post('/sign-up', validateSignUp, userController.create);

router.post('/login', validateLogin, userController.login);

router.post('/logout', userController.logout);

// Chỉ cho phép admin truy cập danh sách tất cả người dùng
router.get('/get-all', verifyToken, requireAdmin, userController.getAllUser);

// Cho phép admin xem thông tin của bất kỳ người dùng nào hoặc người dùng xem thông tin của chính họ
router.get('/get-details/:id', verifyToken, requireSelfOrAdmin, userController.getDetailsUser);

module.exports = router;
