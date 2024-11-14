const express = require('express');
const router = express.Router();

const {
    verifyToken,
    requireAdmin,
    requireSelfOrAdmin,
    validateUpdatePlayer,
} = require('../middlewares/playerMiddleware');
const playerController = require('../controllers/PlayerController');

router.put('/update/:id', validateUpdatePlayer, playerController.updatePlayer);

// Chỉ cho phép admin truy cập danh sách tất cả người dùng
router.get('/get-all', verifyToken, requireAdmin, playerController.getAllInfo);

// Cho phép admin xem thông tin của bất kỳ người dùng nào hoặc người dùng xem thông tin của chính họ
router.get('/get-details/:id', verifyToken, requireSelfOrAdmin, playerController.getDetailsInfo);

module.exports = router;
