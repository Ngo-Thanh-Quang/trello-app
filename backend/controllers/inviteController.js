const inviteModel = require('../models/inviteModel');

// Gửi lời mời tham gia board
exports.inviteToBoard = async (req, res) => {
  const { member_id, email_member, status = 'pending' } = req.body;
  const boardId = req.params.boardId;
  const board_owner_id = req.userEmail; // Lấy email của người tạo bảng

  if (!member_id) {
    return res.status(400).json({ message: 'Thiếu member_id' });
  }

  try {
    const invitation = await inviteModel.createInvitation({
      invite_id: Date.now().toString(), // Tạo id đơn giản, có thể dùng uuid
      board_owner_id,
      board_id: boardId,
      member_id,
      email_member,
      status,
    });
    return res.status(200).json({ success: true, invitation });
  } catch (error) {
    console.error('Lỗi gửi lời mời:', error);
    return res.status(500).json({ message: 'Gửi lời mời thất bại' });
  }
};

// Chấp nhận/từ chối lời mời tham gia card
exports.acceptInvite = async (req, res) => {
  const { invite_id, card_id, member_id, status } = req.body;
  if (!invite_id || !member_id || !status) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
  }

  try {
    const result = await inviteModel.updateInvitationStatus({
      invite_id,
      card_id,
      member_id,
      status,
    });
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Lỗi xác nhận lời mời:', error);
    return res.status(500).json({ message: 'Xác nhận lời mời thất bại' });
  }
};